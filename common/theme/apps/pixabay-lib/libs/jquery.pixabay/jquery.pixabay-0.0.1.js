/**
 * Pixabay API library for the {@link http://www.kademi.co/|Kademi} platform
 * 
 * @author Wesley Tuzza <wesley@tuzza.co>
 * 
 * @license
 * MIT License
 * Copyright (c) 2017 Tuzza.co
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function($) {
    var MODAL_TEMPLATE = '<div class="modal fade pixabaySearchModal" data-backdrop="static" data-keyboard="false" id="pixabaySearchModal-{{instanceId}}" role="dialog" tabindex="-1"> <div class="modal-dialog modal-lg" role="document"> <div class="modal-content"> <div class="modal-header"> <button aria-label="Close" class="close btn-pixabay-close" type="button"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title">{{modalTitle}}</h4> </div><div class="modal-body"> <div class="row pixabaySearchContainer"> <div class="col-xs-8 col-xs-offset-2"> <div class="input-group"> <input class="form-control pixabaySearch" placeholder="Search term..." type="text" value="{{defaultQuery}}"> <span class="input-group-btn"> <button class="btn btn-default btn-pixabaySearch" type="button"> <i class="glyphicon glyphicon-search"></i> </button> </span> </div>{{#if showFilter}}<div class="form-inline pixabay-filters"> <div class="form-group pixabay-filter"> <input checked="checked" class="css-checkbox" id="pixabay_filter_photos" type="checkbox"> <label class="css-label lite-gray-check" for="pixabay_filter_photos">Photos</label> </div><div class="form-group pixabay-filter"> <input class="css-checkbox" id="pixabay_filter_illustration" type="checkbox"> <label class="css-label lite-gray-check" for="pixabay_filter_illustration">Illustrations</label> </div><div class="form-group pixabay-filter"> <input checked="checked" class="css-checkbox" id="pixabay_filter_horizontal" type="checkbox"> <label class="css-label lite-gray-check" for="pixabay_filter_horizontal">Horizontal</label> </div><div class="form-group pixabay-filter"> <input checked="checked" class="css-checkbox" id="pixabay_filter_vertical" type="checkbox"> <label class="css-label lite-gray-check" for="pixabay_filter_vertical">Vertical</label> </div></div>{{/if}}</div></div><div class="row"> <div class="col-md-12 pixabaySearchContainer"> <div class="pixabayGallery flex-images"></div><div class="text-center pixabayNoResultsDiv lead" style="display: none;"> <p> <br/> Sorry, we couldn&#x27;t find any matches. </p></div><div class="text-center pixabayLoadingDiv"> <i class="glyphicon glyphicon-refresh glyphicon-spin glyphicon-3x"></i> </div><div class="text-center pixabayPaginationDiv" style="display: none;"></div></div></div></div><div class="modal-footer"> <span class="pull-left text-left">Powered By<br><a href="https://pixabay.com/" target="_blank"> <img alt="Pixabay" height="17" src="/theme/apps/pixabay-lib/libs/jquery.pixabay/img/logo.svg" width="auto"> </a> </span> <button class="btn btn-default btn-pixabay-close" type="button">{{btnCloseText}}</button> <button class="btn btn-primary btn-pixabay-save" type="button" disabled="disabled">{{btnSaveText}}</button> </div></div></div></div>';
    var IMG_RESULT_TEMPLATE = '<div class="item" data-w="{{previewWidth}}" data-h="{{previewHeight}}" data-idhash="{{id_hash}}"><img src="{{previewURL}}" alt="">{{#if user}}{{#if user_id}}<div><div class="counts hide-xs hide-sm"><em><a class="credits-link" href="https://pixabay.com/users/{{user}}-{{user_id}}/" target="_blank">{{user}}</a> @ <a class="credits-link" href="https://pixabay.com/" target="_blank">Pixabay</a></em></div></div>{{/if}}{{/if}}</div>';

    var COMPILED_MODAL_TEMPLATE = Handlebars.compile(MODAL_TEMPLATE);
    var COMPILED_IMG_RESULT_TEMPLATE = Handlebars.compile(IMG_RESULT_TEMPLATE);

    var DEFAULT_OPTIONS = {
        url: '/_pixabayImage',
        title: 'Image Search',
        btnCloseText: 'Cancel',
        btnSaveText: 'Save',
        searchOptions: {
            per_page: 20
        },
        showFilter: true,
        defaultQuery: null,
        onSelect: null,
        onSave: null,
        onCancel: null,
        isModal: true
    };

    var PixabayModal = function(element, options) {
        var $this = this;
        $this.$elem = $(element);

        // Parse the options
        $this.$options = DEFAULT_OPTIONS;
        if (typeof options === 'object') {
            $this.$options = $.extend(true, {}, DEFAULT_OPTIONS, options);
            if ($this.$options.isModal === null || typeof $this.$options.isModal === 'undefined') {
                $this.$options.isModal = true;
            } else if (typeof $this.$options.isModal === 'string') {
                $this.$options.isModal = $this.$options.isModal.toLowerCase() == 'true';
            }
        }

        if ($this.$options.isModal) {

        }
        // Save modalId
        $this.$instanceId = (new Date()).getTime();

        // Generate the modal
        var vars = {
            instanceId: $this.$instanceId,
            modalTitle: $this.$options.title,
            showFilter: $this.$options.showFilter,
            defaultQuery: $this.$options.defaultQuery || '',
            btnCloseText: $this.$options.btnCloseText,
            btnSaveText: $this.$options.btnSaveText
        };

        var modalHtml = COMPILED_MODAL_TEMPLATE(vars);

        $('body').append(modalHtml);

        $this.$modal = $('#pixabaySearchModal-' + $this.$instanceId);

        // Register Modal Even listeners
        $this.$modal.on('show.bs.modal', function(e) {
            // Revert Save Button
            $this.$modal.find('button.btn-pixabay-save')
                .html($this.$options.btnSaveText);
        });

        $this.$modal.on('shown.bs.modal', function(e) {
            $this.search();
        });

        $this.$modal.on('hidden.bs.modal', function(e) {
            $this.$modal.find('div.item').removeClass('selected');
            $this.$modal.find('.pixabayGallery').empty();
            $this.$modal.find('.pixabayLoadingDiv').show();
            $this.$modal.find('.pixabayNoResultsDiv').hide();
            $this.$modal.find('.pixabaySearch').val($this.$options.defaultQuery || '');
            $this.$modal.find('.pixabayPaginationDiv').hide().empty();
        });

        // Register Button Event listener
        $this.$elem.on('click', function(e) {
            e.preventDefault();
            $this.show();
        });

        // Register Search Change
        $this.$modal.on('change', '.pixabaySearch', function(e) {
            $this.search();
        });

        // Register Search button
        $this.$modal.on('click', '.btn-pixabaySearch', function(e) {
            e.preventDefault();
            $this.search();
        });

        // Register Image Select
        $this.$modal.on('click', 'div.item', function(e) {
            $this._INTERNAL._handleOnSelect.call($this, this);
        });

        $this.$modal.on('click', 'div.item .credits-link', function(e) {
            e.stopPropagation();
        });

        $this.$modal.on('click', '.btn-pixabay-previous', function(e) {
            e.preventDefault();

            $this.previous();
        });

        $this.$modal.on('click', '.btn-pixabay-next', function(e) {
            e.preventDefault();

            $this.next();
        });

        // Register Close button listener
        $this.$modal.on('click', '.btn-pixabay-close', function(e) {
            $this._INTERNAL._handleOnCancel.call($this, this);
        });

        // Register Save button listener
        $this.$modal.on('click', '.btn-pixabay-save', function(e) {
            var sel = $this.$modal.find('div.item.selected');

            if (sel.length > 0) {
                $this._INTERNAL._handleOnSave.call($this, this);
            } else {
                $this._INTERNAL._handleOnCancel.call($this, this);
            }
        });
    };

    PixabayModal.prototype = {
        show: function() {
            this.$modal.modal('show');
        },
        hide: function() {
            this.$modal.modal('hide');
        },
        selected: function() {
            var sel = this.$modal.find('div.item.selected');

            if (sel.length > 0) {
                return sel.data('imagedetails');
            }

            return null;
        },
        next: function() {
            var $this = this;

            $this.$currentPage = $this.$currentPage || 1;
            $this.$currentPage++;

            $this.search($this.$currentPage);
        },
        previous: function() {
            var $this = this;

            $this.$currentPage = $this.$currentPage || 1;
            if ($this.$currentPage > 1) {
                $this.$currentPage--;

                $this.search($this.$currentPage);
            }
        },
        destroy: function() {
            var $this = this;

            var isInstantiated = !!$this.$elem.data('pixabayModal');

            if (isInstantiated) {
                $this.$currentPage = null;

                $this.$elem.off('click');

                $this.$modal.on('hidden.bs.modal', function(e) {
                    $this.$modal.off('hidden.bs.modal');
                    $this.$elem.removeData('pixabayModal');
                    $this.$modal.remove();
                });

                $this.hide();
            }
        },
        search: function(pageNumber) {
            var $this = this;

            $this.$currentPage = pageNumber || 1;
            $this.$modal.find('div.item').removeClass('selected');
            $this.$modal.find('.pixabayGallery').hide().empty();
            $this.$modal.find('.pixabayLoadingDiv').show();
            $this.$modal.find('.pixabayPaginationDiv').hide().empty();
            $this.$modal.find('.pixabayNoResultsDiv').hide();
            $this.$modal.find('.btn-pixabay-save').prop('disabled', true);
            var q = $this.$modal.find('.pixabaySearch').val() || $this.$options.defaultQuery || '';

            var data = $.extend({}, $this.$options.searchOptions);
            data.q = q;
            data.page = $this.$currentPage;

            $.ajax({
                url: $this.$options.url,
                dataType: 'JSON',
                data: data,
                success: function(resp) {
                    var newImages = [];
                    for (var i = 0; i < resp.result.hits.length; i++) {
                        var hit = resp.result.hits[i];

                        var item = COMPILED_IMG_RESULT_TEMPLATE(hit);

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
                            if (resp.result.total > ($this.$currentPage * $this.$options.searchOptions.per_page)) {
                                bar += '<button class="btn btn-default btn-pixabay-next">Next <i class="fa fa-chevron-right" aria-hidden="true"></i></button>';
                                showPagination = true;
                            }

                            bar += '</div>';
                        }

                        $this.$modal.find('.pixabayGallery').append(newImages);
                        $this.$modal.find('.pixabayGallery').show();
                        $this.$modal.find('.pixabayGallery').flexImages({
                            rowHeight: 150,
                            maxRows: 5,
                            truncate: false
                        });

                        if (showPagination) {
                            $this.$modal.find('.pixabayPaginationDiv').append(bar);
                            $this.$modal.find('.pixabayPaginationDiv').show();
                        }
                    } else {
                        $this.$modal.find('.pixabayNoResultsDiv').show();
                    }

                    $this.$modal.find('.pixabayLoadingDiv').hide();
                },
                error: function(jqXHR, textStatus, errorThrown) {

                }
            });
        },
        _INTERNAL: {
            _handleOnSelect: function(elem) {
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
                    $this.$modal.find('.btn-pixabay-save').prop('disabled', false);
                }
            },
            _handleOnSave: function() {
                var $this = this;
                var sel = $this.$modal.find('div.item.selected');

                // Adjust save button
                $this.$modal.find('button.btn-pixabay-save')
                    .html('<span class="glyphicon glyphicon-refresh glyphicon-spin"></span>');

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

                // Revert Save Button
                $this.$modal.find('button.btn-pixabay-save')
                    .html($this.$options.btnSaveText);
            },
            _handleOnCancel: function() {
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

    $.fn.pixabayModal = function(options) {
        if (typeof options === 'string' && this.data('pixabayModal')) {
            var data = this.data('pixabayModal');
            return data[options]();
        }

        return this.each(function() {
            var $this = $(this),
                data = $this.data('pixabayModal');
            if (!data)
                $this.data('pixabayModal', (data = new PixabayModal(this, options)));
            if (typeof options === 'string')
                return data[options]();
        });
    };

    $.fn.pixabayModal.Constructor = PixabayModal;
})(jQuery);