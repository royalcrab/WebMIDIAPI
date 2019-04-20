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

unsigned int calc(unsigned char a, unsigned char b)
{
  unsigned int ax = (int)a;
  unsigned int bx = (int)b;

  if ( ax & 0x80 )
    return ((ax & 0x7f) << 7) | (bx & 0x7f);

  return b;
}

int main( int argc, char* argv[] )
{
  unsigned char header[18] = { 0x4d, 0x54, 0x68, 0x64, 0, 0, 0, 6,
   0, 0, 0, 1, 0, 0x78, 0x4d, 0x54, 0x72, 0x6b };

  FILE *fp, *fp2;
  int size;
  int c1, c2, c3, c4, c5;
  unsigned char buf[256];
  unsigned long int count = 0;
  unsigned int length;

  fp2 = fopen("tmp.txt", "r");
  fp = fopen("out.mid", "w" );
  if ( fp == NULL || fp2 == NULL ){
    perror("file:" );
    return -1;
  }
  
  fseek(fp2, 0, SEEK_END); 
  size = ftell(fp2); 
  fseek(fp2, 0, SEEK_SET); 

  fwrite( header, 18, 1, fp );
  fwrite( &count, sizeof(unsigned int), 1, fp );

  printf( "size: %d\n", size );
  while ( 1 ){
    fread( buf, 5, 1, fp2);
    if ( feof(fp2) ) break;
    if ( ferror(fp2) ){
      perror( "read file" );
      break;
    }

    length = calc( buf[3], buf[4]);

    printf( "%d, %d, %d, %d, %d, %d\n", buf[0], buf[1], buf[2], buf[3], buf[4], length );
    if ( buf[3] == 0 ){
      fwrite(buf+4, 1, 1, fp );
      count += 4;
    }else{
      fwrite(buf+3, 2, 1, fp );
      count += 5;
    }
    fwrite( buf, 3, 1, fp );

  }

  fseek(fp, 18, SEEK_SET); 
  printf( "buffer size: %ld (%lx)\n", count, count );
  count = (((count >> 24) & 0x000000ff) | ((count >> 8) & 0x0000ff00) |
    ((count << 8 ) & 0x00ff0000) | ((count << 24) & 0xff000000));
  fwrite( &count, sizeof(unsigned int), 1, fp );
  
  fclose( fp );
  fclose( fp2 );

  return 0;
}
