# # Linux Server Setup Guide (Oracle Cloud & Ubuntu 20.04)

This guide covers how to assign a public IP to an existing Oracle Cloud instance and how to set up a new Ubuntu 20.04 server for your EPOS system.

## 1. How to Fix Missing Public IP in Oracle Cloud

If your instance shows a dash (`-`) instead of a public IP, follow these steps to assign one:

1.  **Open Oracle Cloud Console**: Navigate to your instance's detail page.
2.  **Go to Attached VNICs**: Scroll down to the bottom left menu "Resources" and click **Attached VNICs**.
3.  **Click VNIC Instance**: Click the name of the VNIC attached to your instance.
4.  **Go to IP Addresses**: On the VNIC page, look at the "Resources" sidebar again and click **IP Addresses**.
5.  **Edit Private IP**: Click the "three dots" menu (Actions) on the right side of your primary private IP address.
6.  **Select Public IP**: Select **Edit**.
    *   Choose **Ephemeral Public IP** (or Reserved if you have one).
    *   Give it a name.
7.  **Save/Update**: Click **Update**. The public IP should now appear on your instance dashboard.

> [!IMPORTANT]
> Ensure your VCN has an **Internet Gateway** attached and your **Route Table** has a rule for `0.0.0.0/0` pointing to that gateway, otherwise the public IP won't be reachable.

---

## 2. Creating an Ubuntu 20.04 Server on Oracle Cloud

1.  **Compute > Instances**: Click **Create Instance**.
2.  **Image and Shape**:
    *   **Image**: Click "Change Image" and select **Canonical Ubuntu 20.04**.
    *   **Shape**: Select `VM.Standard.E4.Flex` (or the Always Free `VM.Standard.A1.Flex` if available).
3.  **Networking (Crucial Steps)**: 
    *   **Primary VNIC**: Select your existing VCN and Subnet.
    *   **Public IPv4 Address**: This is where you might have missed it! In the "Public IPv4 address assignment" section, you **MUST** switch the toggle for **"Automatically assign public IPv4 address"** to **ON** (so it turns blue).
    *   *Note*: Ensure the Subnet you selected is a "Public Subnet".
4.  **SSH Keys**: 
    *   Select **Generate a key pair for me**.
    *   **CRITICAL**: Click **Save Private Key** AND **Save Public Key** before you click create. You cannot download them later!
5.  **Create**: Click **Create**.

---

## 3. Initial Server Setup (Post-SSH)

Once instance is "Running", SSH into it:
```bash
ssh -i your-key.key ubuntu@YOUR_PUBLIC_IP
```

### A. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### B. Install Node.js (using NVM)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

### C. Install PM2 (Process Manager)
```bash
npm install -g pm2
```

### D. Firewall Configuration (UFW)
Oracle has its own cloud firewall (Security Lists), but you should also set up UFW locally:
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### E. Install & Configure Nginx
```bash
sudo apt install nginx -y
```

Create a site config:
```bash
sudo nano /etc/nginx/sites-available/epos
```
Add this:
```nginx
server {
    listen 80;
    server_name yourdomain.com; # or your IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Link and restart:
```bash
sudo ln -s /etc/nginx/sites-available/epos /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 4. Deploying the App
1.  Clone your repo.
2.  Copy `.env.local` to the server.
3.  Run `npm install` and `npm run build`.
4.  Start with PM2:
    ```bash
    pm2 start npm --name "epos-app" -- start
    pm2 save
    pm2 startup
    ```
