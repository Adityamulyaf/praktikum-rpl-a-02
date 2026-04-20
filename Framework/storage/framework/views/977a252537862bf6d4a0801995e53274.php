<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Chat Gemini AI</title>
    <style>
        body { font-family: sans-serif; max-width: 700px; margin: 40px auto; padding: 0 20px; }
        #chatbox { border: 1px solid #ddd; border-radius: 8px; padding: 15px; min-height: 300px; margin-bottom: 15px; overflow-y: auto; max-height: 400px; }
        .user-msg { text-align: right; margin: 8px 0; }
        .user-msg span { background: #0084ff; color: white; padding: 8px 14px; border-radius: 18px; display: inline-block; }
        .ai-msg { text-align: left; margin: 8px 0; }
        .ai-msg span { background: #f0f0f0; padding: 8px 14px; border-radius: 18px; display: inline-block; }
        .input-area { display: flex; gap: 10px; }
        input { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; }
        button { padding: 10px 20px; background: #0084ff; color: white; border: none; border-radius: 8px; cursor: pointer; }
        button:hover { background: #0066cc; }
        #resetBtn { background: #ff4444; }
    </style>
</head>
<body>
    <h2>💬 Chat dengan Gemini AI</h2>

    <div id="chatbox"></div>

    <div class="input-area">
        <input type="text" id="message" placeholder="Ketik pesan..." onkeypress="if(event.key==='Enter') sendMessage()">
        <button onclick="sendMessage()">Kirim</button>
        <button id="resetBtn" onclick="resetChat()">Reset</button>
    </div>

    <script>
        async function sendMessage() {
            const input = document.getElementById('message');
            const message = input.value.trim();
            if (!message) return;

            appendMessage('user', message);
            input.value = '';

            appendMessage('ai', '⏳ Mengetik...');

            const res = await fetch('/chat/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': '<?php echo e(csrf_token()); ?>'
                },
                body: JSON.stringify({ message })
            });

            const data = await res.json();

            // Hapus pesan loading
            const chatbox = document.getElementById('chatbox');
            chatbox.removeChild(chatbox.lastChild);

            appendMessage('ai', data.reply ?? data.error);
        }

        async function resetChat() {
            await fetch('/chat/reset', {
                method: 'POST',
                headers: { 'X-CSRF-TOKEN': '<?php echo e(csrf_token()); ?>' }
            });
            document.getElementById('chatbox').innerHTML = '';
        }

        function appendMessage(role, text) {
            const chatbox = document.getElementById('chatbox');
            const div = document.createElement('div');
            div.className = role === 'user' ? 'user-msg' : 'ai-msg';
            div.innerHTML = `<span>${text}</span>`;
            chatbox.appendChild(div);
            chatbox.scrollTop = chatbox.scrollHeight;
        }
    </script>
</body>
</html><?php /**PATH /var/www/html/resources/views/chat.blade.php ENDPATH**/ ?>