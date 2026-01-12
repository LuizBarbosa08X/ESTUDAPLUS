# 📱 Guia Completo - Instalar Emulador Android

## ✅ Status da sua instalação:
- ✅ Node.js: Instalado (v22.17.0)
- ❌ Java JDK: Não instalado
- ❌ Android SDK: Não configurado

---

## 🎯 Opção 1: Android Studio (RECOMENDADO)

Esta é a forma mais fácil e completa. O Android Studio inclui tudo que você precisa.

### Passo 1: Baixar Android Studio

1. Acesse: https://developer.android.com/studio
2. Clique em "Download Android Studio"
3. Aceite os termos e baixe (≈1GB)

### Passo 2: Instalar Android Studio

1. Execute o instalador baixado
2. Na instalação, certifique-se de marcar:
   - ✅ Android SDK
   - ✅ Android SDK Platform
   - ✅ Android Virtual Device (AVD)
3. Clique em "Next" até finalizar
4. **Local padrão de instalação:**
   - Android Studio: `C:\Program Files\Android\Android Studio`
   - Android SDK: `C:\Users\vito1\AppData\Local\Android\Sdk`

### Passo 3: Configurar Android Studio

1. Abra o Android Studio
2. Na tela inicial, clique em "More Actions" → "SDK Manager"
3. Na aba "SDK Platforms", marque:
   - ✅ Android 13.0 (Tiramisu) - API Level 33
   - ✅ Android 12.0 (S) - API Level 31
4. Na aba "SDK Tools", marque:
   - ✅ Android SDK Build-Tools
   - ✅ Android Emulator
   - ✅ Android SDK Platform-Tools
   - ✅ Android SDK Command-line Tools
   - ✅ Intel x86 Emulator Accelerator (HAXM installer)
5. Clique em "Apply" e aguarde o download

### Passo 4: Criar um Emulador

1. No Android Studio, vá em "More Actions" → "Virtual Device Manager"
2. Clique em "Create Device"
3. Escolha um dispositivo (recomendado: **Pixel 5**)
4. Clique em "Next"
5. Escolha a imagem do sistema:
   - **Tiramisu (API 33)** ou **S (API 31)**
   - Clique em "Download" se necessário
6. Clique em "Next" e depois "Finish"

### Passo 5: Configurar Variáveis de Ambiente

**Opção A: Usando PowerShell (temporário)**
```powershell
$env:ANDROID_HOME = "C:\Users\vito1\AppData\Local\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\platform-tools"
$env:Path += ";$env:ANDROID_HOME\emulator"
$env:Path += ";$env:ANDROID_HOME\tools"
$env:Path += ";$env:ANDROID_HOME\tools\bin"
```

**Opção B: Configuração Permanente (RECOMENDADO)**
1. Pressione `Win + R`, digite `sysdm.cpl` e pressione Enter
2. Vá na aba "Avançado"
3. Clique em "Variáveis de Ambiente"
4. Em "Variáveis do usuário", clique em "Novo":
   - Nome: `ANDROID_HOME`
   - Valor: `C:\Users\vito1\AppData\Local\Android\Sdk`
5. Selecione a variável "Path" e clique em "Editar"
6. Adicione estas linhas:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\emulator`
   - `%ANDROID_HOME%\tools`
   - `%ANDROID_HOME%\tools\bin`
7. Clique em "OK" em todas as janelas
8. **FECHE e ABRA novamente o VS Code e o terminal**

### Passo 6: Testar a Instalação

Feche e abra novamente o terminal, depois execute:
```powershell
adb --version
emulator -list-avds
```

---

## 🎯 Opção 2: Android Studio Manual (Avançado)

Se você quiser apenas o SDK sem a IDE completa:

### 1. Instalar Java JDK

1. Acesse: https://adoptium.net/
2. Baixe o **Temurin JDK 17** (LTS)
3. Instale e configure a variável `JAVA_HOME`

### 2. Instalar Android SDK Command Line Tools

1. Acesse: https://developer.android.com/studio#command-tools
2. Baixe "Command line tools only"
3. Extraia para: `C:\Android\cmdline-tools\latest`
4. Configure as variáveis de ambiente

### 3. Instalar componentes via linha de comando

```powershell
sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0" "emulator" "system-images;android-33;google_apis;x86_64"
```

---

## 🚀 Como Executar o App no Emulador

### Método 1: Via Android Studio

1. Abra o Android Studio
2. Vá em "Virtual Device Manager"
3. Clique no botão ▶️ (Play) do seu emulador
4. Aguarde o emulador iniciar (pode levar 2-3 minutos)
5. No VS Code, execute:
```bash
npm start
```
6. Pressione `a` para abrir no Android

### Método 2: Via Linha de Comando

```powershell
# 1. Listar emuladores disponíveis
emulator -list-avds

# 2. Iniciar emulador específico
emulator -avd Pixel_5_API_33

# 3. Em outro terminal, rodar o app
npm start
# Pressione 'a' para Android
```

### Método 3: Expo Go (Mais Rápido para Testar)

1. Instale o Expo Go no seu celular:
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

2. Execute no terminal:
```bash
npx expo start
```

3. Escaneie o QR Code com:
   - **Android**: App Expo Go
   - **iOS**: Câmera do iPhone

---

## 🐛 Problemas Comuns

### Erro: "adb: command not found"
**Solução**: Variáveis de ambiente não configuradas. Refaça o Passo 5.

### Erro: "ANDROID_HOME is not set"
**Solução**: Configure a variável ANDROID_HOME corretamente.

### Emulador muito lento
**Soluções:**
1. Habilite a virtualização no BIOS
2. Instale HAXM (Intel) ou Hyper-V (AMD)
3. Use um celular físico ao invés do emulador

### Erro: "SDK location not found"
**Solução:**
1. Crie o arquivo `android/local.properties`
2. Adicione: `sdk.dir=C:\\Users\\vito1\\AppData\\Local\\Android\\Sdk`

### App não conecta ao emulador
```powershell
# Reiniciar ADB
adb kill-server
adb start-server
adb devices
```

---

## 📱 Alternativas ao Emulador

### 1. Dispositivo Físico (MELHOR PERFORMANCE)

**Vantagens:**
- Muito mais rápido
- Testa em hardware real
- Melhor para depuração

**Como usar:**
1. Ative "Modo Desenvolvedor" no Android:
   - Configurações → Sobre o telefone
   - Toque 7x em "Número da versão"
2. Ative "Depuração USB"
3. Conecte via USB
4. Execute: `adb devices`
5. Autorize a conexão no celular

### 2. Expo Go (MAIS FÁCIL)
- Sem necessidade de Android Studio
- Funciona no seu celular
- Ideal para desenvolvimento rápido

### 3. Genymotion
- Emulador alternativo
- Mais rápido que o padrão
- Versão gratuita disponível

---

## ✅ Checklist Final

Antes de executar o app, verifique:

- [ ] Android Studio instalado
- [ ] SDK instalado (API 31 ou 33)
- [ ] Emulador criado
- [ ] Variáveis de ambiente configuradas
- [ ] Terminal reiniciado após configurar variáveis
- [ ] `adb devices` mostra dispositivos
- [ ] Emulador iniciado e desbloqueado

---

## 🎬 Comandos Rápidos

```powershell
# Verificar instalação
adb --version
emulator -list-avds
$env:ANDROID_HOME

# Iniciar emulador
emulator -avd Pixel_5_API_33

# Ver dispositivos conectados
adb devices

# Iniciar app
npm start
# Depois pressione 'a'

# Ou diretamente
npm run android

# Limpar cache se houver problemas
npm start -- --reset-cache
```

---

## 📞 Precisa de Ajuda?

Se encontrar problemas:
1. Verifique os logs de erro
2. Consulte: https://reactnative.dev/docs/environment-setup
3. Ou me pergunte! 😊

---

## 🚀 Próximos Passos

Depois de instalar tudo:
1. Configure a API Key da OpenAI (veja OPENAI_SETUP.md)
2. Teste todas as funcionalidades no emulador
3. Configure o Supabase para produção
4. Prepare para publicar na Google Play Store

Boa sorte com o desenvolvimento! 🎉
