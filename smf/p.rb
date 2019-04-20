pre = 0

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
        print [a.to_s(16), b.to_s(16), c.to_s(16), time.to_s(16), "\n"].join(',')
    }
end