while buf = gets
    buf.sub(/<li>(\d+),(\d+),(\d+),(\d+)<\/li>/){
        |m|
        p m
    }
end