<?php
/*
  Aluva · recepción de consultas del formulario web.

  El formulario abre WhatsApp y, con el mismo clic, manda acá los datos. Esto:
    1. crea la consulta en Kommo (embudo "Consultas web"), con el contacto, el
       origen del anuncio (utm_*) y una nota con el detalle;
    2. manda el evento Lead a Meta por la API de Conversiones (mismo event_id
       que el pixel del navegador, así Meta cuenta uno solo);
    3. si Kommo no responde o no está configurado, manda la consulta por mail y
       siempre deja una copia en un CSV de respaldo fuera de la carpeta pública.

  La configuración (tokens) NO va en este archivo: se lee de aluva-config.php,
  una carpeta arriba de public_html. Modelo: lead-config.example.php.
*/
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function responder(int $codigo, array $datos) {
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') responder(405, ['ok' => false]);

$cfgRuta = null;
foreach ([dirname(__DIR__) . '/aluva-config.php', __DIR__ . '/lead-config.php'] as $r) {
    if (is_file($r)) { $cfgRuta = $r; break; }
}
$C = $cfgRuta ? (require $cfgRuta) : [];
$cfg = fn(string $k, $def = '') => $C[$k] ?? $def;
$dirPrivado = $cfgRuta ? dirname($cfgRuta) : sys_get_temp_dir();

/* ---- Origen: sólo desde la propia web ---- */
$origenHttp = $_SERVER['HTTP_ORIGIN'] ?? '';
$permitidos = $cfg('ORIGENES', ['https://aluva.com.ar', 'https://www.aluva.com.ar']);
if ($origenHttp !== '' && !in_array($origenHttp, $permitidos, true)) responder(403, ['ok' => false]);

/* ---- Datos ---- */
$raw = file_get_contents('php://input', false, null, 0, 20000) ?: '';
$in = json_decode($raw, true);
if (!is_array($in)) responder(400, ['ok' => false]);
if (!empty($in['web'])) responder(200, ['ok' => true]); // campo trampa

$txt = function ($v, int $max = 200): string {
    $v = is_scalar($v) ? (string)$v : '';
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v) ?? '';
    return mb_substr(trim($v), 0, $max);
};
$nombre    = $txt($in['nombre'] ?? '', 80);
$telefono  = preg_replace('/\D/', '', $txt($in['telefono'] ?? '', 20));
$zona      = $txt($in['zona'] ?? '', 80);
$productos = $txt($in['productos'] ?? '', 200);
$tipo      = $txt($in['tipo'] ?? '', 60);
$mensaje   = $txt($in['mensaje'] ?? '', 1000);
$archivos  = (int)($in['archivos'] ?? 0);
$eventId   = $txt($in['event_id'] ?? '', 64);
$url       = $txt($in['url'] ?? '', 500);
$fbp       = $txt($in['fbp'] ?? '', 120);
$fbc       = $txt($in['fbc'] ?? '', 300);
$o         = is_array($in['origen'] ?? null) ? $in['origen'] : [];
$utm = [];
foreach (['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'landing'] as $k) {
    $utm[$k] = $txt($o[$k] ?? '', 200);
}

// El navegador ya lo normalizó (549 + 10 dígitos); acá sólo se verifica
if ($nombre === '' || !preg_match('/^549\d{10}$/', $telefono)) responder(422, ['ok' => false]);

/* ---- Límite de envíos por IP (el del navegador se puede saltear) ---- */
$ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
$rlArchivo = sys_get_temp_dir() . '/aluva-rl-' . md5($ip);
$ahora = time();
$marcas = array_filter(json_decode((string)@file_get_contents($rlArchivo), true) ?: [], fn($t) => $ahora - $t < 600);
if (count($marcas) >= 5) responder(429, ['ok' => false]);
$marcas[] = $ahora;
@file_put_contents($rlArchivo, json_encode(array_values($marcas)), LOCK_EX);

/* ---- HTTP ---- */
function http_json(string $metodo, string $url, ?array $cuerpo, array $headers = []): array {
    $ch = curl_init($url);
    $h = array_merge(['Content-Type: application/json', 'Accept: application/json'], $headers);
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => $metodo, CURLOPT_RETURNTRANSFER => true, CURLOPT_HTTPHEADER => $h,
        CURLOPT_CONNECTTIMEOUT => 5, CURLOPT_TIMEOUT => 10,
    ]);
    if ($cuerpo !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($cuerpo, JSON_UNESCAPED_UNICODE));
    $res = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    return [$code, is_string($res) ? (json_decode($res, true) ?? $res) : null, $err];
}

$detalle = implode("\n", array_filter([
    "Consulta desde la web",
    "Nombre: $nombre",
    "Teléfono: +$telefono",
    $zona ? "Zona: $zona" : '',
    "Productos: $productos",
    $tipo ? "Tipo de obra: $tipo" : '',
    $mensaje ? "Detalle: $mensaje" : '',
    $archivos ? "Archivos: $archivos (los manda por WhatsApp)" : '',
    $utm['utm_campaign'] || $utm['utm_source'] ? "Anuncio: {$utm['utm_source']} / {$utm['utm_campaign']} / {$utm['utm_content']}" : 'Origen: sin datos de anuncio (orgánico o directo)',
    $url ? "Página: $url" : '',
]));

/* ---- 1. Kommo ---- */
$kommoOk = false;
$kommoError = 'sin configurar';
$sub = $cfg('KOMMO_SUBDOMINIO');
$tok = $cfg('KOMMO_TOKEN');
if ($sub && $tok) {
    $base = rtrim($cfg('KOMMO_BASE') ?: "https://$sub.kommo.com", '/') . '/api/v4'; // KOMMO_BASE: sólo para pruebas
    $auth = ["Authorization: Bearer $tok"];

    // Contacto existente con ese teléfono (evita duplicar a quien ya escribió)
    $contactoId = null;
    [$c, $r] = http_json('GET', "$base/contacts?limit=1&query=" . urlencode(substr($telefono, -8)), null, $auth);
    if ($c === 200 && is_array($r)) $contactoId = $r['_embedded']['contacts'][0]['id'] ?? null;

    $campos = [];
    $F = $cfg('KOMMO_CAMPOS', []); // ids que devuelve scripts/kommo-setup.mjs
    $valores = [
        'producto' => $productos, 'tipo_obra' => $tipo, 'zona' => $zona,
        'utm_source' => $utm['utm_source'], 'utm_medium' => $utm['utm_medium'], 'utm_campaign' => $utm['utm_campaign'],
        'utm_content' => $utm['utm_content'], 'utm_term' => $utm['utm_term'], 'fbclid' => $utm['fbclid'],
        'canal' => 'Formulario web',
    ];
    foreach ($valores as $k => $v) {
        if ($v !== '' && !empty($F[$k])) $campos[] = ['field_id' => (int)$F[$k], 'values' => [['value' => $v]]];
    }

    $lead = [
        'name' => "Web · $nombre" . ($productos !== 'sin especificar' ? " · $productos" : ''),
        'custom_fields_values' => $campos ?: null,
        '_embedded' => [
            'tags' => [['name' => 'web'], ['name' => $utm['utm_source'] ? 'anuncio' : 'organico']],
            'contacts' => [$contactoId ? ['id' => (int)$contactoId] : [
                'first_name' => $nombre,
                'custom_fields_values' => [['field_code' => 'PHONE', 'values' => [['value' => "+$telefono", 'enum_code' => 'MOB']]]],
            ]],
        ],
    ];
    if ($cfg('KOMMO_EMBUDO')) $lead['pipeline_id'] = (int)$cfg('KOMMO_EMBUDO');
    if ($cfg('KOMMO_ETAPA')) $lead['status_id'] = (int)$cfg('KOMMO_ETAPA');
    $lead = array_filter($lead, fn($v) => $v !== null);

    [$c, $r, $e] = http_json('POST', "$base/leads/complex", [$lead], $auth);
    $leadId = is_array($r) ? ($r[0]['id'] ?? null) : null;
    if ($c >= 200 && $c < 300 && $leadId) {
        $kommoOk = true;
        http_json('POST', "$base/leads/notes", [['entity_id' => (int)$leadId, 'note_type' => 'common', 'params' => ['text' => $detalle]]], $auth);
    } else {
        $kommoError = "HTTP $c " . ($e ?: substr(is_string($r) ? $r : json_encode($r), 0, 300));
    }
}

/* ---- 2. Meta · API de Conversiones ---- */
$pixel = $cfg('META_PIXEL_ID');
$capi = $cfg('META_CAPI_TOKEN');
if ($pixel && $capi && $eventId) {
    $h = fn(string $v) => hash('sha256', mb_strtolower(trim($v)));
    $partes = preg_split('/\s+/', $nombre) ?: [];
    $user = array_filter([
        'ph' => [$h($telefono)],
        'fn' => $partes ? [$h($partes[0])] : null,
        'ln' => count($partes) > 1 ? [$h(end($partes))] : null,
        'country' => [$h('ar')],
        'client_ip_address' => $ip ?: null,
        'client_user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
        'fbp' => $fbp ?: null,
        'fbc' => $fbc ?: null,
    ]);
    $ev = ['data' => [[
        'event_name' => 'Lead', 'event_time' => $ahora, 'event_id' => $eventId,
        'action_source' => 'website', 'event_source_url' => $url ?: 'https://aluva.com.ar/contacto',
        'user_data' => $user, 'custom_data' => ['content_name' => $productos, 'lead_source' => 'formulario_web'],
    ]]];
    if ($cfg('META_TEST_CODE')) $ev['test_event_code'] = $cfg('META_TEST_CODE');
    http_json('POST', ($cfg('META_BASE') ?: 'https://graph.facebook.com') . "/v21.0/$pixel/events?access_token=" . urlencode($capi), $ev);
}

/* ---- 3. Respaldo ---- */
$csv = $dirPrivado . '/leads-respaldo.csv';
$fh = @fopen($csv, 'a');
if ($fh) {
    fputcsv($fh, [date('c'), $nombre, "+$telefono", $zona, $productos, $tipo, $mensaje, $utm['utm_source'], $utm['utm_campaign'], $utm['utm_content'], $kommoOk ? 'kommo' : "SIN KOMMO: $kommoError"], ',', '"', '\\');
    fclose($fh);
}
if (!$kommoOk && $cfg('MAIL_DESTINO')) {
    $de = $cfg('MAIL_REMITENTE', 'web@aluva.com.ar');
    $asunto = '=?UTF-8?B?' . base64_encode("Consulta web: $nombre") . '?=';
    @mail($cfg('MAIL_DESTINO'), $asunto, $detalle . "\n\n(No se pudo cargar en Kommo: $kommoError)",
        "From: Web Aluva <$de>\r\nContent-Type: text/plain; charset=UTF-8");
}

responder(200, ['ok' => true]);
