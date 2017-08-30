(function ($) {
    var MODAL_TEMPLATE = '<div id="pixabaySearchModal-{{modalId}}" class="modal fade pixabaySearchModal" tabindex="-1" role="dialog" data-keyboard="false" data-backdrop="static">'
            + '    <div class="modal-dialog modal-lg" role="document">'
            + '        <div class="modal-content">'
            + '            <div class="modal-header">'
            + '                <button type="button" class="close btn-pixabay-close" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
            + '                <h4 class="modal-title">{{modalTitle}}</h4>'
            + '            </div>'
            + '            <div class="modal-body">'
            + '                <div class="row pixabaySearchContainer">'
            + '                    <div class="col-xs-8 col-xs-offset-2">'
            + '                        <div class="input-group">'
            + '                            <input type="text" class="form-control pixabaySearch" placeholder="Search term..." value="{{initQuery}}">'
            + '                            <span class="input-group-btn">'
            + '                                <button class="btn btn-default btn-pixabaySearch" type="button"><span class="glyphicon glyphicon-search"></span></button>'
            + '                            </span>'
            + '                        </div>'
            + '                        {{filterTemplate}}'
            + '                    </div>'
            + '                </div>'
            + '                <div class="row">'
            + '                    <div class="col-md-12 pixabaySearchContainer">'
            + '                        <div class="pixabayGallery flex-images">'
            + '                        </div>'
            + '                        <div class="text-center pixabayNoResultsDiv lead" style="display: none;"><p><br/>Sorry, we couldn\'t find any matches.</p></div>'
            + '                        <div class="text-center pixabayLoadingDiv"><i class="fa fa-refresh fa-spin fa-3x"></i></div>'
            + '                        <div class="text-center pixabayPaginationDiv" style="display: none;"></div>'
            + '                    </div>'
            + '                </div>'
            + '            </div>'
            + '            <div class="modal-footer">'
            + '                <span class="pull-left text-left">Powered By<br/>'
            + '                    <a target="_blank" href="https://pixabay.com/"><img height="17" width="auto" src="/theme/apps/pixabay-lib/libs/jquery.pixabay/img/logo.svg" alt="Pixabay"></a>'
            + '                </span>'
            + '                <button type="button" class="btn btn-default btn-pixabay-close">{{btnCloseText}}</button>'
            + '                <button type="button" class="btn btn-primary btn-pixabay-save">{{btnSaveText}}</button>'
            + '            </div>'
            + '        </div>'
            + '    </div>'
            + '</div>';

    var FILTER_TEMPLATE = '<div class="form-inline pixabay-filters">'
            + '                            <div class="form-group pixabay-filter">'
            + '                                <input type="checkbox" class="css-checkbox" id="pixabay_filter_photos" checked="checked">'
            + '                                <label for="pixabay_filter_photos" class="css-label lite-gray-check">Photos</label>'
            + '                            </div>'
            + '                            <div class="form-group pixabay-filter">'
            + '                                <input type="checkbox" class="css-checkbox" id="pixabay_filter_illustration">'
            + '                                <label for="pixabay_filter_illustration" class="css-label lite-gray-check">Illustrations</label>'
            + '                            </div>'
            + '                            <div class="form-group pixabay-filter">'
            + '                                <input type="checkbox" class="css-checkbox" id="pixabay_filter_horizontal" checked="checked">'
            + '                                <label for="pixabay_filter_horizontal" class="css-label lite-gray-check">Horizontal</label>'
            + '                            </div>'
            + '                            <div class="form-group pixabay-filter">'
            + '                                <input type="checkbox" class="css-checkbox" id="pixabay_filter_vertical" checked="checked">'
            + '                                <label for="pixabay_filter_vertical" class="css-label lite-gray-check">Vertical</label>'
            + '                            </div>'
            + '                        </div>';

    var DEFAULT_OPTIONS = {
        url: '/_pixabayImage',
        title: 'Image Search',
        btnCloseText: 'Cancel',
        btnSaveText: 'Save',
        searchOptions: {
            per_page: 20
        },
        showFilter: true,
        initQuery: null,
        onSelect: null,
        onSave: null,
        onCancel: null
    };

    var PixabayModal = function (element, options) {
        var $this = this;
        $this.$elem = $(element);

        // Parse the options
        $this.$options = DEFAULT_OPTIONS;
        if (typeof options === 'object') {
            $this.$options = $.extend(true, {}, DEFAULT_OPTIONS, options);
        }

        // Save modalId
        $this.$modalId = (new Date()).getTime();

        // Generate the modal
        var modalHtml = MODAL_TEMPLATE
                .replace('{{modalId}}', $this.$modalId)
                .replace('{{modalTitle}}', $this.$options.title)
                .replace('{{initQuery}}', $this.$options.initQuery || '')
                .replace('{{btnCloseText}}', $this.$options.btnCloseText)
                .replace('{{btnSaveText}}', $this.$options.btnSaveText);

        var filterTemplate = '';
        if ($this.$options.showFilter) {
            filterTemplate = FILTER_TEMPLATE;
        }
        modalHtml = modalHtml.replace('{{filterTemplate}}', filterTemplate);

        $('body').append(modalHtml);

        $this.$modal = $('#pixabaySearchModal-' + $this.$modalId);

        // Register Modal Even listeners
        $this.$modal.on('shown.bs.modal', function (e) {
            $this.search();
        });

        $this.$modal.on('hidden.bs.modal', function (e) {
            $this.$modal.find('div.item').removeClass('selected');
            $this.$modal.find('.pixabayGallery').empty();
            $this.$modal.find('.pixabayLoadingDiv').show();
            $this.$modal.find('.pixabayNoResultsDiv').hide();
            $this.$modal.find('.pixabaySearch').val('');
            $this.$modal.find('.pixabayPaginationDiv').hide().empty();
        });

        // Register Button Event listener
        $this.$elem.on('click', function (e) {
            e.preventDefault();
            $this.show();
        });

        // Register Search Change
        $this.$modal.on('change', '.pixabaySearch', function (e) {
            $this.search();
        });

        // Register Search button
        $this.$modal.on('click', '.btn-pixabaySearch', function (e) {
            e.preventDefault();
            $this.search();
        });

        // Register Image Select
        $this.$modal.on('click', 'div.item', function (e) {
            $this._INTERNAL._handleOnSelect.call($this, this);
        });

        $this.$modal.on('click', '.btn-pixabay-previous', function (e) {
            e.preventDefault();

            $this.previous();
        });

        $this.$modal.on('click', '.btn-pixabay-next', function (e) {
            e.preventDefault();

            $this.next();
        });

        // Register Close button listener
        $this.$modal.on('click', '.btn-pixabay-close', function (e) {
            $this._INTERNAL._handleOnCancel.call($this, this);
        });

        // Register Save button listener
        $this.$modal.on('click', '.btn-pixabay-save', function (e) {
            var sel = $this.$modal.find('div.item.selected');

            if (sel.length > 0) {
                $this._INTERNAL._handleOnSave.call($this, this);
            } else {
                $this._INTERNAL._handleOnCancel.call($this, this);
            }
        });
    };

    PixabayModal.prototype = {
        show: function () {
            this.$modal.modal('show');
        },
        hide: function () {
            this.$modal.modal('hide');
        },
        selected: function () {
            var sel = this.$modal.find('div.item.selected');

            if (sel.length > 0) {
                return sel.data('imagedetails');
            }

            return null;
        },
        next: function () {
            var $this = this;

            $this.$currentPage = $this.$currentPage || 1;
            $this.$currentPage++;

            $this.search($this.$currentPage);
        },
        previous: function () {
            var $this = this;

            $this.$currentPage = $this.$currentPage || 1;
            if ($this.$currentPage > 1) {
                $this.$currentPage--;

                $this.search($this.$currentPage);
            }
        },
        destroy: function () {
            var $this = this;

            var isInstantiated = !!$this.$elem.data('pixabayModal');

            if (isInstantiated) {
                $this.$currentPage = null;

                $this.$elem.off('click');

                $this.$modal.on('hidden.bs.modal', function (e) {
                    $this.$modal.off('hidden.bs.modal');
                    $this.$elem.removeData('pixabayModal');
                    $this.$modal.remove();
                });

                $this.hide();
            }
        },
        search: function (pageNumber) {
            var $this = this;

            $this.$currentPage = pageNumber || 1;
            $this.$modal.find('div.item').removeClass('selected');
            $this.$modal.find('.pixabayGallery').hide().empty();
            $this.$modal.find('.pixabayLoadingDiv').show();
            $this.$modal.find('.pixabayPaginationDiv').hide().empty();
            $this.$modal.find('.pixabayNoResultsDiv').hide();
            var q = $this.$modal.find('.pixabaySearch').val() || $this.$options.defaultQuery || '';

            var data = $.extend({}, $this.$options.searchOptions);
            data.q = q;
            data.page = $this.$currentPage;

            $.ajax({
                url: $this.$options.url,
                dataType: 'JSON',
                data: data,
                success: function (resp) {
                    var newImages = [];
                    for (var i = 0; i < resp.result.hits.length; i++) {
                        var hit = resp.result.hits[i];

                        var item = '<div class="item" data-w="' + hit.previewWidth + '" data-h="' + hit.previewHeight + '" data-imageid="' + hit.id + '">'
                                + '    <img src="' + hit.previewURL + '" alt="">';

                        if (hit.likes !== null && typeof hit.likes !== 'undefined') {
                            item += '    <div>'
                                    + '        <div class="counts hide-xs hide-sm">'
                                    + '            <em><i class="fa fa-thumbs-o-up"></i> ' + hit.likes + '</em>'
                                    + '            <em><i class="fa fa-star-o"></i> ' + hit.favorites + '</em>'
                                    + '            <em><i class="fa fa-comment-o"></i> ' + hit.comments + '</em>'
                                    + '        </div>'
                                    + '    </div>';
                        }

                        item += +'</div>';

                        item = $(item);

                        item.data('imagedetails', hit);
                        newImages.push(item);
                    }

                    if (newImages.length > 0) {
                        var showPagination = false;
                        var bar = '';

                        if (resp.result.total > $this.$options.searchOptions.per_page) {
                            // Generate pagination bar
                            var bar = '<div class="btn-group">';

                            // Previous Button
                            if ($this.$currentPage > 1) {
                                bar += '<button class="btn btn-default btn-pixabay-previous"><i class="fa fa-chevron-left" aria-hidden="true"> Previous</i></button>';
                                showPagination = true;
                            }

                            // Next Button
                            if (resp.result.totalHits > ($this.$currentPage * $this.$options.searchOptions.per_page)) {
                                bar += '<button class="btn btn-default btn-pixabay-next">Next <i class="fa fa-chevron-right" aria-hidden="true"></i></button>';
                                showPagination = true;
                            }

                            bar += '</div>';
                        }

                        $this.$modal.find('.pixabayGallery').append(newImages);
                        $this.$modal.find('.pixabayGallery').show();
                        $this.$modal.find('.pixabayGallery').flexImages({rowHeight: 150, maxRows: 5, truncate: false});

                        if (showPagination) {
                            $this.$modal.find('.pixabayPaginationDiv').append(bar);
                            $this.$modal.find('.pixabayPaginationDiv').show();
                        }
                    } else {
                        $this.$modal.find('.pixabayNoResultsDiv').show();
                    }

                    $this.$modal.find('.pixabayLoadingDiv').hide();
                },
                error: function (jqXHR, textStatus, errorThrown) {

                }
            });
        },
        _INTERNAL: {
            _handleOnSelect: function (elem) {
                var $this = this;

                var imgDetails = $(elem).data('imagedetails');
                var evt = jQuery.Event('pxb.selected');
                evt.data = imgDetails;

                if (typeof $this.$options.onSelect === 'function') {
                    $this.$options.onSelect.call(elem, evt, imgDetails);
                }

                if (!evt.isDefaultPrevented()) {
                    $this.$elem.trigger(evt, imgDetails);
                }

                if (!evt.isDefaultPrevented()) {
                    evt.preventDefault();

                    $this.$modal.find('div.item').removeClass('selected');
                    $(elem).addClass('selected');
                }
            },
            _handleOnSave: function () {
                var $this = this;
                var sel = $this.$modal.find('div.item.selected');

                var imageDetails = null;

                if (sel.length > 0) {
                    imageDetails = sel.data('imagedetails');
                }

                var evt = jQuery.Event('pxb.save');
                evt.data = imageDetails;

                if (typeof $this.$options.onSave === 'function') {
                    $this.$options.onSave.call(this, evt, imageDetails);
                }

                if (!evt.isDefaultPrevented()) {
                    $this.$elem.trigger(evt, imageDetails);
                }

                if (!evt.isDefaultPrevented()) {
                    $this.hide();
                }
            },
            _handleOnCancel: function () {
                var $this = this;
                var evt = jQuery.Event('pxb.cancel');

                if (typeof $this.$options.onCancel === 'function') {
                    $this.$options.onCancel.call(this, evt);
                }

                if (!evt.isDefaultPrevented()) {
                    $this.$elem.trigger(evt);
                }

                if (!evt.isDefaultPrevented()) {
                    $this.hide();
                }
            }
        }
    };

    $.fn.pixabayModal = function (options) {
        if (typeof options === 'string' && this.data('pixabayModal')) {
            var data = this.data('pixabayModal');
            return data[options]();
        }

        return this.each(function () {
            var $this = $(this)
                    , data = $this.data('pixabayModal');
            if (!data)
                $this.data('pixabayModal', (data = new PixabayModal(this, options)));
            if (typeof options === 'string')
                return data[options]();
        });
    };

    $.fn.pixabayModal.Constructor = PixabayModal;
})(jQuery);