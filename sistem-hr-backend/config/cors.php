<?php

$splitEnvList = static fn (string $value): array => array_values(array_filter(array_map(
    static fn (string $item) => trim($item),
    explode(',', $value),
)));

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => $splitEnvList((string) env(
        'CORS_ALLOWED_ORIGINS',
        implode(',', [
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'http://localhost:5174',
            'http://127.0.0.1:5174',
            'http://localhost:4173',
            'http://127.0.0.1:4173',
            'https://sistem-hr.vercel.app',
        ]),
    )),
    'allowed_origins_patterns' => $splitEnvList((string) env(
        'CORS_ALLOWED_ORIGINS_PATTERNS',
        '^https://.*\.vercel\.app$',
    )),
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
