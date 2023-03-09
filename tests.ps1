$venv = './.venv';
$azTls = './redis-az-ca/az-tls';
$tls = './redis/tests/tls';
if (Test-Path -Path $venv) {
    Write-Output "Virtual environment OK.";
} else {
    Write-Output "Intitialize virtual environment. Typically: 'python3 -m venv .venv; ./.venv/Scripts/Activate.ps1; pip install -r requirements.txt' "
}

if (Test-Path -Path $azTls) {
  Write-Output "Azure certificates OK.";
} else {
  Write-Output "From WSL2 do: (cd ./redis-az-ca; sh ./gen_certs_az.sh)"
}

if (Test-Path -Path $tls) {
  Write-Output "Redis documented certificates OK.";
} else {
  Write-Output "From WSL2 do: (cd ./redis; sh ./gen_certs.sh)"
}

$dockerProcess = Get-Process 'com.docker.proxy'

if (!$dockerProcess){
  Write-Error("Docker process isn't running!")
  Exit-PSSession;
}

# .venv\Scripts\python.exe -m unittest
.venv\Scripts\python.exe -m tap
npm test
