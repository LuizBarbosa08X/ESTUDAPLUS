# 🚀 Quick Start - Executar o App

## 📋 Pré-requisitos Necessários

Você precisa ter instalado:
- ✅ Node.js (v22+) - **JÁ INSTALADO** ✓
- ❌ Android Studio com SDK
- ❌ Java JDK
- ❌ Emulador Android ou dispositivo físico

---

## ⚡ Instalação Rápida (15-20 minutos)

### 1️⃣ Baixar e Instalar Android Studio

**Download:** https://developer.android.com/studio

Durante a instalação, marque:
- ✅ Android SDK
- ✅ Android SDK Platform  
- ✅ Android Virtual Device

### 2️⃣ Configurar SDK no Android Studio

1. Abra Android Studio
2. Vá em: **More Actions → SDK Manager**
3. Na aba **SDK Platforms**, instale:
   - ✅ Android 13.0 (Tiramisu) - API 33
4. Na aba **SDK Tools**, instale:
   - ✅ Android SDK Build-Tools
   - ✅ Android Emulator
   - ✅ Android SDK Platform-Tools
5. Clique em **Apply**

### 3️⃣ Criar um Emulador

1. No Android Studio: **More Actions → Virtual Device Manager**
2. Clique em **Create Device**
3. Escolha: **Pixel 5**
4. Sistema: **Tiramisu (API 33)**
5. Clique em **Finish**

### 4️⃣ Configurar Variáveis de Ambiente

**IMPORTANTE:** Feche todos os terminais antes de configurar!

1. Pressione `Win + R`
2. Digite: `sysdm.cpl` e Enter
3. Aba **Avançado** → **Variáveis de Ambiente**
4. Em "Variáveis do usuário" → **Novo**:
   ```
   Nome: ANDROID_HOME
   Valor: C:\Users\vito1\AppData\Local\Android\Sdk
   ```
5. Selecione **Path** → **Editar** → Adicionar:
   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\emulator
   %ANDROID_HOME%\tools
   ```
6. Clique **OK** em tudo
7. **FECHE E ABRA NOVAMENTE** o VS Code

### 5️⃣ Verificar Instalação

Abra um **NOVO** terminal e execute:

```powershell
# Verificar tudo automaticamente
.\verificar-ambiente.ps1
```

Ou verificar manualmente:
```powershell
adb --version
emulator -list-avds
```

---

## 🏃 Executar o App

### Opção 1: Scripts Automáticos

**Terminal 1** - Iniciar emulador:
```powershell
.\iniciar-emulador.ps1
```

**Terminal 2** - Executar app:
```powershell
npm start
# Pressione 'a' para Android
```

### Opção 2: Comandos Manuais

**Terminal 1** - Iniciar emulador:
```powershell
emulator -avd Pixel_5_API_33
```

**Terminal 2** - Executar app:
```powershell
npm start
# ou
npm run android
```

---

## 📱 Alternativa: Usar Celular Real

**Mais rápido e melhor que emulador!**

1. **No celular Android:**
   - Configurações → Sobre o telefone
   - Toque 7x em "Número da versão"
   - Volte → Sistema → Opções do desenvolvedor
   - Ative "Depuração USB"

2. **Conecte via USB**

3. **Verifique conexão:**
   ```powershell
   adb devices
   ```

4. **Execute o app:**
   ```powershell
   npm start
   # Pressione 'a'
   ```

---

## 🐛 Problemas Comuns

### "adb: command not found"
**Solução:** Variáveis de ambiente não configuradas. Refaça passo 4.

### "ANDROID_HOME is not set"  
**Solução:** Feche TODOS os terminais e VS Code, reabra e teste novamente.

### Emulador não aparece
```powershell
adb kill-server
adb start-server
adb devices
```

### App não instala
```powershell
npm start -- --reset-cache
```

---

## 🎯 Usando Expo Go (Mais Fácil!)

**Sem necessidade de Android Studio!**

1. Instale **Expo Go** no seu celular:
   - https://play.google.com/store/apps/details?id=host.exp.exponent

2. Execute:
   ```bash
   npm start
   ```

3. **Escaneie o QR Code** com o app Expo Go

**Pronto!** O app vai abrir no seu celular.

---

## 📚 Guias Detalhados

- **Instalação completa:** `GUIA_INSTALACAO_ANDROID.md`
- **OpenAI API:** `OPENAI_SETUP.md`
- **Sistema de Vidas:** `SISTEMA_VIDAS_GEMAS.md`

---

## ✅ Checklist Final

Antes de executar:
- [ ] Android Studio instalado
- [ ] SDK API 33 instalado
- [ ] Emulador criado
- [ ] Variáveis ANDROID_HOME configuradas
- [ ] Terminal reiniciado
- [ ] `adb devices` funciona
- [ ] `npm install` executado

---

## 🆘 Precisa de Ajuda?

Execute o verificador:
```powershell
.\verificar-ambiente.ps1
```

Se o problema persistir, consulte:
- `GUIA_INSTALACAO_ANDROID.md` (detalhado)
- https://reactnative.dev/docs/environment-setup

**Boa sorte!** 🎉
