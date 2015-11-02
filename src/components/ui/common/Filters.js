
exports.filterByText = function(elements, value){
    return elements.filter(function(item){
        return item.getText().then(function (text) {
            return text === value;
        });
    })
};