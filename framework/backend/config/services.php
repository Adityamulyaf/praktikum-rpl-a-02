<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'gemini' => [
        'key' => env('GEMINI_API_KEY'),
    ],

    'whatsapp' => [
        'provider' => env('WHATSAPP_PROVIDER', 'fonnte'),
        'fonnte_api_url' => env('WHATSAPP_FONNTE_API_URL', 'https://api.fonnte.com/send'),
        'fonnte_token' => env('WHATSAPP_FONNTE_TOKEN'),
        'twilio_sid' => env('WHATSAPP_TWILIO_SID'),
        'twilio_token' => env('WHATSAPP_TWILIO_TOKEN'),
        'twilio_from' => env('WHATSAPP_TWILIO_FROM'),
        'enabled' => env('WHATSAPP_ENABLED', false),
    ],

];
