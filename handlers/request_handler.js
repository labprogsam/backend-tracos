const requestHandler = async (req, res) => {
    let body = {};
  
    if (res.locals.data || res.locals.data === false) body = res.locals.data;
  
    res.status(res.locals.status || 200).json(body);
  };
  
  export default requestHandler;    