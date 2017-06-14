var fortunes = [
    "Vzetiq izpit e kato nevzetiq, samo che vzet",
    "Kazval sum go mnogo puti, shte go kaja pak: Kazval sum go mnogo puti",
    "Golqm zaluk lapni, i go sduvchi dobre",
    "Burzata rabota - stava burzo",
    "Vulkut kojata si meni, no vutreshnite organi ne",
]

exports.getFortune = function() {
        var idx = Math.floor(Math.random() * fortunes.length);
        return fortunes[idx];
};
