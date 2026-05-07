<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laravel React Vite</title>

    @if (app()->environment('local'))
    <script type="module">
        import RefreshRuntime from 'http://localhost:5173/@@react-refresh'
        RefreshRuntime.injectIntoGlobalHook(window)
        window.$RefreshReg$ = () => {}
        window.$RefreshSig$ = () => (type) => type
        window.__vite_plugin_react_preamble_installed__ = true
    </script>
    <script type="module" src="http://localhost:5173/@@vite/client"></script>
    <script type="module" src="http://localhost:5173/src/main.jsx"></script>
@else
    @php
        $manifest = json_decode(file_get_contents(public_path('build/manifest.json')), true);
    @endphp
    <link rel="stylesheet" href="/build/{{ $manifest['src/main.jsx']['css'][0] }}">
    <script type="module" src="/build/{{ $manifest['src/main.jsx']['file'] }}"></script>
@endif
</head>
<body>
    <div id="root"></div> 
</body>
</html>