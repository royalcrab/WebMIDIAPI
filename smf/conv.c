#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main( int argc, char* argv[] )
{
  char header[18] = { 0x4d, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 0, 0, 1. 0. 0x78, 0x4d, 0x54 };

  FILE *fp;
  fp = fopen("out.mid", "bw" );
  
  
  fclose( fp );

  return 0;
}
