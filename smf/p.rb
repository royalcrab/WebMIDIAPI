pre = 0
open('tmp.txt', 'wb'){ |f|
    while buf = gets
        buf.scan(/<li>(\d+),(\d+),(\d+),(\d+)<\/li>/){
            |m|
            time = ($4.to_i - pre) if pre > 0
            time = 1000 if pre == 0
            time = 16000 if time > 16000
            pre = $4.to_i
            a = $1.to_i
            b = $2.to_i
            c = $3.to_i

            ta = time & 0x7f;
            tb = (time >> 7) & 0x7f;
            tb |= 0x80 if (time & 0x80) > 0

            f.write([a,b,c,tb,ta].pack("C*"))

#            print [a, b, c, tb, ta, "\n"].join(',')
        }
    end
}
