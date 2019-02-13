let Trusted = ['$sce', ($sce) => {
  return function(text) {
    return $sce.trustAsHtml(text);
  };
}];


module.exports = {Trusted};