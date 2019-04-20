while buf = gets
    buf.scan(/<li>(\d+),(\d+),(\d+),(\d+)<\/li>/){
        |m|
        time = $4.to_i
        a = $1.to_i
        b = $2.to_i
        c = $3.to_i
        print [a.to_s(16), b.to_s(16), c.to_s(16), time.to_s(16), '\n'].join(',')
    }
end