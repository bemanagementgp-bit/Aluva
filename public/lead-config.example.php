<?php
/*
  MODELO de configuración de lead.php. No poner tokens reales en este archivo.

  En el hosting: copiar como  aluva-config.php  UNA CARPETA ARRIBA de
  public_html (fuera de lo que se ve desde internet) y completar.
  Los ids de KOMMO_* salen al correr  node scripts/kommo-setup.mjs.
*/
return [
    // Kommo: subdominio (lo que va antes de .kommo.com) y token de larga duración
    // (Ajustes → Integraciones → crear integración privada → Claves y alcances)
    'KOMMO_SUBDOMINIO' => 'aluva',
    'KOMMO_TOKEN'      => '',
    'KOMMO_EMBUDO'     => 0,  // id del embudo "Consultas web"
    'KOMMO_ETAPA'      => 0,  // id de la etapa "Nueva consulta"
    'KOMMO_CAMPOS'     => [   // id de cada campo personalizado del lead
        'producto' => 0, 'tipo_obra' => 0, 'zona' => 0, 'canal' => 0,
        'utm_source' => 0, 'utm_medium' => 0, 'utm_campaign' => 0, 'utm_content' => 0, 'utm_term' => 0, 'fbclid' => 0,
    ],

    // Meta: id del pixel/dataset y token de la API de Conversiones
    // (Administrador de eventos → el dataset → Configuración → Generar token)
    'META_PIXEL_ID'   => '',
    'META_CAPI_TOKEN' => '',
    'META_TEST_CODE'  => '', // sólo para probar (pestaña "Probar eventos"); dejar vacío en producción

    // Respaldo si Kommo falla
    'MAIL_DESTINO'   => 'ventas@aluva.com.ar',
    'MAIL_REMITENTE' => 'web@aluva.com.ar',

    'ORIGENES' => ['https://aluva.com.ar', 'https://www.aluva.com.ar'],
];
