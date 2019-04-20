while buf = gets
    buf.scan(/<li>(\d+),(\d+),(\d+),(\d+)<\/li>/){
        |m|
        p m
    }
end