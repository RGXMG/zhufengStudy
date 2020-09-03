## 压缩与解压缩的命令

### zip 格式压缩

支持压缩文件或者目录，是一种压缩格式

- zip [文件名].zip [源文件]: 压缩文件
  - -r：压缩文件夹，如：`zip file.zip -r rgxmgDir` 压缩 rgxmgDir 目录
- unzip [文件名].zip：解压缩文件

### gzip 格式压缩

高压缩比文件，只支持压缩单文件；

- gzip [源文件]：将源文件进行压缩，但是源文件会消失；
- gzip -c [源文件] -> [压缩文件]：压缩文件，但是源文件不会消失，如：`gzip -c log.txt -> log.txt.gzip`;
- gzip -r [目录]：将目录中的每个文件进行单独的压缩，而非压缩文件夹压缩，并删除源文件，当前目录无变化;
- gzip -d [压缩文件名]: 解压缩文件、不保留压缩包;
- gunzip [压缩文件名]：解压缩文件，也不保留压缩包；

### bz2 格式压缩

bzip2 是一个压缩能力更强的压缩程序

### tar 格式打包

打包命令，只是将指定的文件夹打包成一个文件

- tar -cvf [打包后的文件名][源文件]
  -c 打包
  -v 显示打包信息
  -f 指定打包后的文件名
- -x 解压，如：`tar -xvf temp.tar temp`，将 temp.tar 打包文件解压成 temp 文件夹；

#### tar.gz 格式压缩

由于 tar 可以有打包功能，没有压缩功能，但是 gzip 或者 bz2 可以压缩文件，所以可以通过命令去操作，一步到位；

- tar -zcvf [压缩后的名称].tar.gz [源文件夹]：打包并压缩成 gz 格式，如`tar -zcvf temp.tar.gz temp`；
- tar -zxvf [压缩文件]: 解压文件
- tar -jcvf [压缩后的名称].tar.bz2 [源文件夹]：打包并压缩成 bz2 格式，如`tar -zcvf temp.tar.bz2 temp`；
