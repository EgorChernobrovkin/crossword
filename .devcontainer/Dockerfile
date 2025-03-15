FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye

# Install Chrome for testing (optional, but recommended)
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Install global packages
RUN npm install -g @angular/cli@19 \
    && npm install -g typescript@5.4 \
    && npm install -g @ngrx/schematics@19

# Set up Chrome for testing
ENV CHROME_BIN=/usr/bin/google-chrome 