#include <stdio.h>
#include <stdlib.h>
#include <string.h>

unsigned long int conv( unsigned long int x )
{
  unsigned long int a, b, c, d;
  a = (x << 3) && 0x7f000000;
  b = (x << 2) && 0x007f0000;
  c = (x << 1) && 0x00007f00;
  d = x        && 0x0000007f;
  if ( x && 0x00000080 ) c |= 0x8000;
  if ( x && 0x00004000 ) b |= 0x800000;
  if ( x && 0x00200000 ) a |= 0x80000000;
  return ( a | b | c | d );
}

int main( int argc, char* argv[] )
{
  unsigned char header[18] = { 0x4d, 0x54, 0x68, 0x64, 0, 0, 0, 6, 0, 0, 0, 1, 0, 0x78, 0x4d, 0x54, 0x72, 0x6b };

  FILE *fp;
  fp = fopen("out.mid", "w" );
  if ( fp == NULL ){
    perror("file:" );
    return -1;
  }
  
  fwrite( header, 18, 1, fp );
  
  fclose( fp );

  return 0;
}
