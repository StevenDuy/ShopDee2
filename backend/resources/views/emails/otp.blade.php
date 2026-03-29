<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>ShopDee Neural Sync</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #030712; margin: 0; padding: 0; color: #ffffff; }
        .container { max-width: 600px; margin: 40px auto; background: linear-gradient(135deg, rgba(23, 37, 84, 0.4) 0%, rgba(30, 58, 138, 0.2) 100%); border-radius: 32px; border: 1px solid rgba(255, 255, 255, 0.1); padding: 40px; text-align: center; backdrop-filter: blur(20px); }
        .logo { font-size: 24px; font-weight: 900; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 30px; background: linear-gradient(to right, #60a5fa, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .title { font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: rgba(255, 255, 255, 0.4); margin-bottom: 20px; font-style: italic; }
        .code { font-size: 48px; font-weight: 900; letter-spacing: 12px; color: #60a5fa; margin: 30px 0; background: rgba(96, 165, 250, 0.1); padding: 20px; border-radius: 20px; border: 1px dashed rgba(96, 165, 250, 0.3); }
        .desc { font-size: 12px; font-weight: 500; color: rgba(255, 255, 255, 0.5); line-height: 1.6; margin-bottom: 30px; }
        .footer { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: rgba(255, 255, 255, 0.2); border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">ShopDee 2.0</div>
        <div class="title">Identity Verification Pulse</div>
        <p class="desc">We detected a synchronization request for your ShopDee Neural Identity. Use the pulse code below to authorize the handshake.</p>
        <div class="code">{{ $code }}</div>
        <p class="desc">This code expires in 15 minutes. If you did not request this, your neural node remains secure—simply ignore this pulse.</p>
        <div class="footer">Autonomous AI Sandbox &bull; Secure Protocol 4.2</div>
    </div>
</body>
</html>
