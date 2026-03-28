$file = "c:\Users\krhd1\Desktop\vibecoding\daker.hackathon\src\data\seed.ts"
$lines = Get-Content $file
$lines[507] = "  })),"
$lines[525] = "  })),"
$lines[543] = "  })),"
$lines | Set-Content $file
