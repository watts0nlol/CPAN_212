const auth = (req, res, next) =>{
    
    if(req.query.username == "Alex") {
        next();
    } else {
        res.send("Not authorized leave now!! - Grug")
    }
}

export default auth;