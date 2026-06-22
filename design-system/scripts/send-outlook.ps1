# send-outlook.ps1 — send ONE outreach mail through the LOCAL classic Outlook (COM).
#
# Driven by the dev endpoint POST /__send-outlook (see vite.config.ts). Outlook desktop
# is signed in with modern auth (OAuth), so this sends from the operator's ETH mailbox
# WITHOUT SMTP credentials — bypassing the M365 basic-auth block that fails SMTP with
# "535 5.7.3 Authentication unsuccessful". Reads {to,subject,body,from?} as JSON on
# stdin (UTF-8) and prints exactly one JSON line on stdout (UTF-8).
#
# `from` (optional): the SMTP address of the Outlook account to send AS. When several
# accounts exist in the profile, the matching one is selected; if it isn't configured in
# classic Outlook, a clear error lists the accounts that are.
$ErrorActionPreference = 'Stop'

function Emit($obj) {
  $json = $obj | ConvertTo-Json -Compress
  $bytes = [Text.Encoding]::UTF8.GetBytes($json)
  $out = [Console]::OpenStandardOutput()
  $out.Write($bytes, 0, $bytes.Length); $out.Flush()
}

try {
  $reader = New-Object IO.StreamReader([Console]::OpenStandardInput(), [Text.Encoding]::UTF8)
  $raw = $reader.ReadToEnd()
  $in = $raw | ConvertFrom-Json
  if (-not $in.to)      { throw 'Empfaenger (to) fehlt' }
  if (-not $in.subject) { throw 'Betreff (subject) fehlt' }

  $ol = New-Object -ComObject Outlook.Application
  $session = $ol.Session            # MAPI namespace (uses the running, authenticated profile)

  $mail = $ol.CreateItem(0)         # 0 = olMailItem
  $mail.To = [string]$in.to
  $mail.Subject = [string]$in.subject
  $mail.Body = [string]$in.body     # plain text; newlines preserved

  $usedFrom = $null
  if ($in.from -and ([string]$in.from).Trim()) {
    $want = ([string]$in.from).Trim().ToLower()
    foreach ($acct in $session.Accounts) {
      if ($acct.SmtpAddress -and $acct.SmtpAddress.ToLower() -eq $want) {
        $mail.SendUsingAccount = $acct; $usedFrom = $acct.SmtpAddress; break
      }
    }
    if (-not $usedFrom) {
      $have = @($session.Accounts | ForEach-Object { $_.SmtpAddress } | Where-Object { $_ }) -join ', '
      throw "Konto '$want' ist im klassischen Outlook nicht eingerichtet. Vorhandene Konten: $have"
    }
  } else {
    try { $usedFrom = $session.Accounts.Item(1).SmtpAddress } catch { $usedFrom = '' }
  }

  $mail.Send()                      # → Outbox

  # Nudge Outlook to transmit now (don't leave it sitting in the Outbox), then give it a
  # beat before the script exits and releases the COM reference.
  try { foreach ($so in $session.SyncObjects) { $so.Start() } } catch {}
  Start-Sleep -Milliseconds 1200

  Emit ([pscustomobject]@{ ok = $true; sent = $true; from = $usedFrom })
}
catch {
  Emit ([pscustomobject]@{ ok = $false; sent = $false; error = [string]$_.Exception.Message })
}
