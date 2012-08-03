
/*
 * GET home page.
 */

exports.index = function(req, res){
  switch(req.monomi.browserType) {
    case 'touch':
    case 'mobile':
    case 'tablet':
      res.render('mobile');
      break;
    default:
      res.render('index');
      break;
  }
};
