# brew install exiftool
# get pdf file pages number
exiftool -T -filename -PageCount -s3 -FileSize -ext pdf "$1"

