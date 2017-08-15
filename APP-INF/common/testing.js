/* global controllerMappings */

controllerMappings
        .adminController()
        .enabled(true)
        .path('/pixabayTest')
        .addMethod('GET', '_pixabayTest')
        .build();

function _pixabayTest(page, params) {
    var result = Pixabay.imageSearch(page, {
        q: params.q
    });

    return views.textView(JSON.stringify(result), 'text/plain');
}