#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static char* note[12*9] = {
  "C0 ", "Cs0",  "D0 ",  "Ds0",  "E0 ",  "F0",  "Fs0",  "G0 ",  "Gs0",  "A0 ",  "As0",  "B0 ", 
  "C1 ", "Cs1",  "D1 ",  "Ds1",  "E1 ",  "F1",  "Fs1",  "G1 ",  "Gs1",  "A1 ",  "As1",  "B1 ", 
  "C2 ", "Cs2",  "D2 ",  "Ds2",  "E2 ",  "F2",  "Fs2",  "G2 ",  "Gs2",  "A2 ",  "As2",  "B2 ", 
  "C3 ", "Cs3",  "D3 ",  "Ds3",  "E3 ",  "F3",  "Fs3",  "G3 ",  "Gs3",  "A3 ",  "As3",  "B3 ", 
  "C4 ", "Cs4",  "D4 ",  "Ds4",  "E4 ",  "F4",  "Fs4",  "G4 ",  "Gs4",  "A4 ",  "As4",  "B4 ", 
  "C5 ", "Cs5",  "D5 ",  "Ds5",  "E5 ",  "F5",  "Fs5",  "G5 ",  "Gs5",  "A5 ",  "As5",  "B5 ", 
  "C6 ", "Cs6",  "D6 ",  "Ds6",  "E6 ",  "F6",  "Fs6",  "G6 ",  "Gs6",  "A6 ",  "As6",  "B6 ", 
  "C7 ", "Cs7",  "D7 ",  "Ds7",  "E7 ",  "F7",  "Fs7",  "G7 ",  "Gs7",  "A7 ",  "As7",  "B7 ",
  "C8 ", "Cs8",  "D8 ",  "Ds8",  "E8 ",  "F8",  "Fs8",  "G8 ",  "Gs8",  "A8 ",  "As8",  "B8 "
};

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

    if ( buf[0] == 0x90 || buf[0] == 0x80 ){
      printf( "%s: %3d, %3d, %3d, %3d, %3d, %3d; ", note[buf[1]], 
        buf[0], buf[1], buf[2], buf[3], buf[4], length );
      printf( "%2x, %2x, %2x, %2x, %2x, %4x\n",
        buf[0], buf[1], buf[2], buf[3], buf[4], length );
    }else{
      printf( "   : %3d, %3d, %3d, %3d, %3d, %3d; ", 
        buf[0], buf[1], buf[2], buf[3], buf[4], length );
      printf( "%2x, %2x, %2x, %2x, %2x, %4x\n",
        buf[0], buf[1], buf[2], buf[3], buf[4], length );     
    }
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
