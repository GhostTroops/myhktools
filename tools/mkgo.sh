echo outPath outName goSrcFileOrDir
outPath="$1"
outN="$2"
goSrc="$3"
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build  -ldflags "-s -w" -o $outPath/$outN_linux $goSrc
CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -o $outPath/$outN.exe $goSrc
CGO_ENABLED=0 GOOS=darwin GOARCH=amd64 go build -ldflags "-s -w" -o $outPath/$outN_macos $goSrc
upx -9 $outPath/$outN_linux
upx -9 $outPath/$outN.exe



