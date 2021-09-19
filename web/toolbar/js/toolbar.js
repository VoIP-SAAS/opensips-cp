/*===================================================
    File Name: toolbar.js
    Description: install toolbar OpenSIPS specific js
    -------------------------------------------------
    Author: Song H. Networklab
    Author URL: http://networklab.global
=====================================================*/

if (typeof activeModule === 'undefined' || activeModule === null) {
    console.log("undefined active module");
} else
    activePage = activeModule;

if (typeof extraColumn === 'undefined' || extraColumn === null) {
    console.log("undefined active module");
} else {
    extraLimit = extraColumn;
}

try {

    $(document).ready(function () {

        $('.pagingTable').parent().parent().remove();

        // Check jquery
        var selectHead = $('.ttable thead th[class]');
        var rowCount = $('.ttable tr').length;
        var totalCol = 0;

        $('th').each(function () {

            if ($(this).text() === 'Edit' || $(this).text() === 'Delete') {
                if ($(this).text() === 'Edit')
                    var editSelector = true;
                else
                    var editSelector = false;
                $('td:nth-child(' + ($(this).index() + 1) + '), th:nth-child(' + ($(this).index() + 1) + ')').each(function () {
                    if (!$(this).is('th')) {
                        if (editSelector)
                            $(this).parent().append('<input type="hidden" value="' + ($(this).children('a').attr('href')) + '" class="edit-href">');
                        else
                            $(this).parent().append('<input type="hidden" value="' + ($(this).children('a').attr('href')) + '" class="trash-href">');
                    }
                    $(this).remove();
                });
            }
        });

        // Right global search
        $('head').append('<style type="text/css">.dataTables_wrapper .dataTables_length {\n' +
            '        float: left;\n' +
            '        padding-top: .755em;\n' +
            '    }</style>');
        $('head').append('<style type="text/css">.dataTables_wrapper .dataTables_filter {\n' +
            '        float: left;\n' +
            '        text-align: left;\n' +
            '    }</style>');

        var extraColRowHtml = "<tr><td><input type='text' name='name[]' class=\"form-control\"></td>" +
            "<td style='width: 30%'>" +
            "   <select  class='form-control' name='attr[]' class=\"form-control\">" +
            "       <option value='int'>int</option>" +
            "       <option value='varchar'>varchar</option>" +
            "   </select>" +
            "</td>" +
            "<td ><input type='number' name='value[]' class=\"form-control\"></td>" +
            "</tr>";

        var extraColHtml = "<form action='toolbar.php' method='post' class='toolbar-form'>" +
            "<input name='active_module' hidden value='" + activePage + "'>" +
            "<div class='table-responsive extra-col'>" +
            "<div class=" +
            "'row'><button type='button' class='btn close btn-danger extra-close'\n" +
            "                data-dismiss='alert' aria-label='Close'>\n" +
            "                <span aria-hidden='true'>×</span>\n" +
            "   </button></" +
            "div><table class='table table-bordered text-center table-striped extra-table' name='extra-table' style='border-radius: 1rem;margin-bottom: 0'>" +
            "   <thead><tr><th  class='text-center'>Column Name</th><th  class='text-center'>Column Type</th><th  class='text-center'>Column Length</th></tr></thead>" +
            "   <tbody>" +
            "       <tr>" +
            "           <td>" +
            "               <input type='text' name='name[]' class=\"form-control\" required>" +
            "           </td>" +
            "           <td style='width: 30%'>" +
            "               <select  class='form-control' name='attr[]' class=\"form-control\">" +
            "                   <option value='int'>int</option>" +
            "                   <option value='varchar'>varchar</option>" +
            "               </select>" +
            "           </td>" +
            "           <td >" +
            "               <input type='number' name='value[]' class=\"form-control\">" +
            "           </td>" +
            "       </tr>" +
            "   </tbody>" +
            "</table>" +
            "<div class='col-12 ntl-mt'" +
            ">" +
            "   <input type='submit' class='btn ntl-btn ntl-btn-success toolbar-save' value='Save'>" +
            "   <a class='btn ntl-btn ntl-btn-danger add-column'>Add</a>" +
            "</div></input></form>";

        var filterHtml = "<div class='col-12 filter-html'><div class='row'>" +
            "<button style='margin: 5px' type='button' class='btn close btn-danger filter-close'\n" +
            "                data-dismiss='alert' aria-label='Close'>\n" +
            "                <span aria-hidden='true'>×</span>\n" +
            "</button>" +
            "</div>" +
            "<div class='row'>" +
            "<div class='col-12'>" +
            "<select class=\"filter-checkbox\" name=\"cols[]\" multiple=\"multiple\" data-width='452px'>" +
            "</select>" +
            "</div>" +
            "<div class='col-12 ntl-mt filter-submit'>" +
            "   <button class='btn ntl-btn ntl-btn-success save-filter'>Save</button>" +
            "   <a class='btn ntl-btn btn-primary all-filter' style='margin: 0 5px'>All</a>" +
            "   <a class='btn ntl-btn ntl-btn-danger reset-filter'>Reset</a>" +
            "</div>" +
            "</div>" +
            "</div>";

        var successAlert = "<div class='alert alert-success alert-dismissible success-alert' role='alert' style='display: none;' id='successAlert'>\n" +
            "          <button type='button' class='close' data-dismiss='alert' aria-label='Close'>\n" +
            "            <span aria-hidden='true'>&times;</span>\n" +
            "          </button>\n" +
            "          <p class='success-msg'><b> You just have added. </b></p>" +
            "   </div>";

        var errorAlert = "<div class='alert alert-danger alert-dismissible error-alert' role='alert' style='display: none' id='errorAlert'>\n" +
            "          <button type='button' class='close' data-dismiss='alert' aria-label='Close'>\n" +
            "            <span aria-hidden='true'>&times;</span>\n" +
            "          </button>\n" +
            "           <p class='error-msg'>You just have added.</p>" +
            "   </div>";


        //Add new row in extra column
        var nToolbar = $('' +
            ' <div class="dropdown toolbar-dropdown">\n' +
            '    <button class="btn dropdown-toggle toolbar-button" type="button" data-toggle="dropdown">Actions\n' +
            '    <span class="caret"></span></button>\n' +
            '    <ul class="dropdown-menu toolbar-menu">\n' +
            '      <li class="show-filter"><a href="#"><i class=\'fa fa-filter\'></i>&nbsp;&nbsp;&nbsp;Filter</a></li>\n' +
            '      <li class="extra-column"><a href="#"><i class=\'fa fa-plus\'></i>&nbsp;&nbsp;&nbsp;Add Column</a></li>\n' +
            '      <li class="hide-show"><a href="#"><i class=\'fa fa-eye-slash hide-show-i\'></i>&nbsp;&nbsp;Hide/Show</a></li>\n' +
            '      <li class="column-short"><a href="#"><i class=\'fa fa-sort\'></i>&nbsp;&nbsp;&nbsp;&nbsp;Sort</a></li>\n' +
            '      <li class="column-edit"><a href="#"><i class=\'fa fa-edit\'></i>&nbsp;&nbsp;Edit</a></li>\n' +
            '      <li class="column-trash"><a href="#"><i class=\'fa fa-trash\'></i>&nbsp;&nbsp;&nbsp;Trash</a></li>\n' +
            '    </ul>\n' +
            '  </div>');

        $('.ttable').show();
        $('.ttable').parent().removeClass('spinner');

        try {

            var ntlTable = $('.ttable').DataTable({
                ordering: false,
                responsive: true,
                "search": {regex: true},
                dom: "<'row'<'col-sm-3 custom-toolbar'><'col-sm-7'f>>" +
                    "<'row'<'col-sm-12 extra-form'>>" +
                    "<'row'<'col-sm-12'tr>>" +
                    "<'row'<'col-sm-4'l><'col-sm-4'i><'col-sm-4'p>>",
            });

            //Adjust filter pos
            $('.ttable td').css('text-align', 'center');
            $('.ttable th').each(function () {
                totalCol++;
                $(this).css('min-width', ($(this).width() + 38) + 'px');

                //Adjust specific column
                if ($(this).text() === 'DB State') {
                    $(this).css('min-width', ($(this).width() + 40) + 'px');
                }

            });

            $('.extra-form').append(extraColHtml);
            $('.extra-form').append(filterHtml);
            $('.filter-checkbox').select2({
                placeholder: "  Select Column",
            });

            var sInput = $('#DataTables_Table_0_filter').find('input');
            $('#DataTables_Table_0_filter').find('label').html('');
            $('#DataTables_Table_0_filter').find('label').append(sInput);
            $('#DataTables_Table_0_filter').find('input').attr('placeholder', '    Search');

        } catch (err) {
            alert(err + " Please check install guide. http://networklab.global/opensips/toolbar");
        }

        $(".custom-toolbar").append(nToolbar);
        gDataTable = ntlTable;


        /*********************************************
         * Add Extra Column on Module Table-  Toolbar *
         **********************************************/

        // Hide/Show extra column
        $('.extra-column').click(function () {
            if ($('.filter-html').length !== 0)
                $('.filter-html').hide(300);
            $('.extra-col').hide(300);
            $('.extra-col').show(400);
        });


        $('.extra-close').click(function () {
            $('.extra-col').hide(400);
        });

        // Add new row on custom table
        $('.add-column').click(function () {
            if (extraLimit < $('.extra-table tr').length) {
                alert("Can't add anymore. Please contact us ")
            } else
                $(".extra-table > tbody").append(extraColRowHtml);
        });

        //Submit request to create new columns
        var request;
        $(".toolbar-form").submit(function (event) {

            $('.show-alert').each(function () {
                $(this).remove();
            });

            event.preventDefault();
            if (request) {
                request.abort();
            }

            var $form = $(this);
            var formVal = "";
            var $inputs = $form.find("input, select, button, textarea");
            var serializedData = $form.serializeArray();

            $('.extra-table').find('tr').each(function () {
                formVal += '&' + this.id + '=' + $(this).text();
            });

            $inputs.prop("disabled", true);

            request = $.ajax({
                url: "/toolbar/toolbar.php",
                type: "post",
                data: serializedData
            });

            request.done(function (response, textStatus, jqXHR) {

                var res = JSON.parse(response);
                for (let i = 0; i < res.length; i++) {
                    if ('error' in res[i]) {
                        $('#DataTables_Table_0_wrapper').prepend(errorAlert);
                        $('.error-msg').text(res[i]['message']);
                        $('.error-msg').removeClass('error-msg');
                        $(".error-alert").show();
                        $(".error-alert").addClass('show-alert');
                        $('.error-alert').removeClass('error-alert');

                    } else if ('success' in res[i]) {
                        $('#DataTables_Table_0_wrapper').prepend(successAlert);
                        $('.success-msg').text(res[i]['message']);
                        $('.success-msg').removeClass('success-msg');
                        $(".success-alert").show();
                        $(".success-alert").addClass('show-alert');
                        $('.success-alert').removeClass('success-alert');
                    }
                }
                setTimeout(function () {
                    $(".show-alert").hide(700)
                }, 5000);
                $(".load-alert").hide();
            });

            request.fail(function (jqXHR, textStatus, errorThrown) {
                // Log the error to the console
                $("#errorAlert").addClass('show');
                console.error(
                    "The following error occurred: " +
                    textStatus, errorThrown
                );
            });

            request.always(function () {
                // re-enable the inputs
                $inputs.prop("disabled", false);
            });

        });


        /*******************************************************************************
         * Custom (Hide/Show, Sorting, Edit/Delete) Action Of Module Table  -  oolbar *
         *******************************************************************************/

            // highlight needed action row
        var oldRowIndex = null;
        $(".ttable").delegate("tr", "click", function () {

            if ($(this).children('th').length) {
                vt = 0;
            } else {
                var curRow = $(this).index();
                if (oldRowIndex !== curRow) {

                    $('tr').removeClass('row-highlight');
                    $(this).addClass('row-highlight');
                    oldRowIndex = curRow;

                } else {

                    if ($(this).hasClass('row-highlight'))
                        $(this).removeClass('row-highlight');
                    else
                        $(this).addClass('row-highlight');
                }
            }
        });


        // hide/show a column
        $('.hide-show').click(function () {

            var highCnt = 0;
            var inRow = 0;

            if ($(this).find('i').hasClass('fa-eye')) {
                location.reload();
            } else
                $('.row-highlight').each(function () {
                    highCnt++;
                    if (!$(this).hasClass('ntl-row-hide'))
                        $(this).addClass('ntl-row-hide');
                });

            if (highCnt === 0 && !$(this).find('i').hasClass('fa-eye'))
                alert("Please select a row if needed actions");

            $('.ntl-row-hide').each(function () {
                inRow++;
            });

            if (inRow === (rowCount - 1)) {
                $(this).find('i').removeClass('fa-eye-slash');
                $(this).find('i').addClass('fa-eye');
            }
        });


        //enable/Disable shorting
        var shortDisabled = true;
        $('.column-short').click(function () {
            if (shortDisabled) {
                ntlTable.destroy();
                ntlTable = $('.ttable').DataTable({
                    responsive: true,
                    "search": {regex: true},
                    dom: "<'row'<'col-sm-3 custom-toolbar'><'col-sm-7'f>>" +
                        "<'row'<'col-sm-12 extra-form'>>" +
                        "<'row'<'col-sm-12'tr>>" +
                        "<'row'<'col-sm-3'l><'col-sm-3'i><'col-sm-6'p>>",
                });

                $(".custom-toolbar").append(nToolbar);
                shortDisabled = false;
                gDataTable = ntlTable;
            } else {
                location.reload();
            }
        });


        // Edit a row
        $('.column-edit').click(function () {
            var highCnt = 0;
            $('.row-highlight').each(function () {
                highCnt++;
                window.location.href = $(this).children('.edit-href').val();
            });
            if (highCnt === 0)
                alert("Please select a row if needed actions");
        });


        // Trash a row
        $('.column-trash').click(function () {
            var highCnt = 0;
            $('.row-highlight').each(function () {
                highCnt++;
                if (confirm("Are you sure this " + activePage + "?")) {
                    window.location.href = $(this).children('.trash-href').val();
                }
            });
            if (highCnt === 0)
                alert("Please select a row if needed actions");
        });


        /********************************************
         * Custom Filter Of Module Table  -  Toolbar*
         *******************************************/

        var filterColIndex = [];
        var oldIndex = null;
        var oldApply = null;

        //install custom filter
        selectHead.each(function (idx) {
            if ($(this).text() === 'Edit' || $(this).text() === 'Delete') {
                $(this).find('i').remove();
            } else {

                var colInx = $(this).index();
                if ($('.dataTables_empty').length === 0) {
                    var noData = true;
                    ntlTable.column(colInx).data().unique().sort().each(function (d, j) {
                        if (d !== "" && d !== '&nbsp;' && d !== '-') {
                            noData = false;
                        }
                    });
                    if (!noData) {
                        filterColIndex.push(colInx);
                    } else {
                        $(this).css('min-width', '10px');
                    }
                } else {
                    $('.ttable').attr('data-toggle', 'tooltip');
                    $('.ttable').attr('title', 'No available filter');
                }
            }
        });

        function loadFilter() {

            $.getJSON("/toolbar/json/toolbar_filter_" + activePage + ".json?v=" + (10 * Math.random() + Math.random()), function (data) {
                var savedFilterIco = $.makeArray(data)[0];
                if (typeof savedFilterIco[activePage] !== 'undefined' && savedFilterIco[activePage].length !== 0) {

                    $('.filter-checkbox').val(savedFilterIco[activePage]);
                    $('.filter-checkbox').trigger('change');

                    for (var ic in savedFilterIco[activePage]) {

                        var val = savedFilterIco[activePage][ic];
                        var filterIco = $(ntlTable.column(val).header());

                        try {
                            if (filterIco.find('.filter-ico').length === 0)
                                filterIco.append('<i class="fa fa-filter filter-ico" data-toggle="tooltip" title="show filter"></i>');
                            else {
                                filterIco.find('.filter-ico').remove();
                                filterIco.append('<i class="fa fa-filter filter-ico" data-toggle="tooltip" title="show filter"></i>');
                            }

                            filterProcess(filterIco);

                        } catch (e) {
                            alert("Something went wrong! Error load filter data");
                            console.log(e);
                        }
                    }
                }

            }).fail(function () {
                alert("Something went wrong!");
            });
        }

        function _filter_keyup_load(ele, selector) {

            var containedKey = $(ele).val().toLowerCase();
            if (containedKey === '' || containedKey === '&nbsp;') {
                $('li.ntl-filter-hide').each(function () {
                    $(this).removeClass('ntl-filter-hide');
                });
            } else {
                $(selector).find('.filter-col').each(function () {
                    var eleVal = $(this).children('a').text().toLowerCase();
                    if (eleVal.indexOf(containedKey) === -1) {
                        $(this).addClass('ntl-filter-hide');
                        $(this).removeClass('ntl-filter-show');
                    } else {
                        if ($(this).hasClass('ntl-filter-hide')) {
                            $(this).removeClass('ntl-filter-hide');
                            $(this).addClass('ntl-filter-show');
                        }
                        $(this).addClass('ntl-filter-show');
                    }
                });
            }

            filterScroll('li.ntl-filter-show');
        }

        function filterScroll(selector) {
            if ($(selector).length > 7)
                $('.filter-col-u').css('overflow-y', 'scroll');
            else
                $('.filter-col-u').css('overflow-y', 'hidden');
        }

        function filterProcess(filterIco) {

            filterIco.find('.filter-ico').click(function () {

                // refresh old result
                var colIndex = $(this).parent().index();
                var filterContent = "" +
                    "<div class='column-filter'>" +
                    "  <ul class=\"nav nav-tabs\">\n" +
                    "        <li class=\"active\"><a data-toggle=\"tab\" href=\"#home\">Contains</a></li>\n" +
                    "       <li class='tab-uncontained'><a data-toggle=\"tab\" href=\"#menu1\">Does Not Contains</a></li>\n" +
                    "  </ul>\n" +
                    "  <div class=\"tab-content\" style='margin-top: 1.1rem;'>\n" +
                    "    <div id=\"home\" class=\"tab-pane fade in active\">\n" +
                    "      <input type='text' class='form-control contained' col-index='" + colIndex + "'>\n" +
                    "      <div class='col-filter contained'></div>\n" +
                    "    </div>\n" +
                    "    <div id=\"menu1\" class=\"tab-pane fade\">\n" +
                    "      <input type='text' class='form-control uncontained' col-index='" + colIndex + "'>\n" +
                    "      <div class='col-filter uncontained' ></div>\n" +
                    "    </div>\n" +
                    "  </div>" +
                    "  <div style='text-align: center'>" +
                    "<a class='btn ntl-filter-btn ntl-btn-success apply-btn' col-index='" + colIndex + "'>Apply</a>" +
                    "<a class='btn ntl-filter-btn ntl-btn-danger reset-btn'  col-index='" + colIndex + "'>Reset</a>" +
                    "</div>" +
                    "</div>";

                var rowCnt = 0;
                var column = ntlTable.column(colIndex);

                if ($('div.column-filter').length) {

                    $('div.column-filter').hide();
                    $('div.column-filter').remove();

                    if (oldIndex !== $(this).parent().index()) {

                        var otherColFilterContent = $(filterContent).appendTo(column.header());
                        var oContentField = $('<ul style="list-style-type: none;padding:0"></ul>');

                        column.data().unique().sort().each(function (d, j) {
                            if (d !== "" && d !== '&nbsp;') {
                                rowCnt++;
                                oContentField.append("<li class='filter-col' row-index='" + colIndex + "'><a href='#'>" + d + "</a></li>");
                            }
                        });
                        oContentField.appendTo($('.col-filter'));
                        otherColFilterContent.show();
                    }

                } else {

                    var colFilterContent = $(filterContent).appendTo(column.header());
                    var contentField = $('<ul class="filter-col-u"></ul>');

                    column.data().unique().sort().each(function (d, j) {
                        if (d !== "" && d !== '&nbsp;') {
                            rowCnt++;
                            contentField.append("<li  class='filter-col' row-index='" + colIndex + "'><a href='#'>" + d + "</a></li>");
                        }
                    });
                    contentField.appendTo($('.col-filter'));
                    colFilterContent.show();
                }

                if (rowCnt === 0)
                    $('.apply-btn').attr('disabled', 'disabled');

                if ($('li.tab-uncontained').hasClass('active'))
                    filterScroll('.uncontained .filter-col');
                else
                    filterScroll('.contained .filter-col');

                oldIndex = $(this).parent().index();

                $('input.contained').keyup(function () {

                    $('.uncontained').val('');
                    $('div.uncontained').find('.filter-col').each(function () {
                        if ($(this).hasClass('ntl-filter-hide')) {
                            $(this).removeClass('ntl-filter-hide');
                            $(this).removeClass('ntl-filter-show');
                        }
                    });

                    _filter_keyup_load(this, 'div.contained');

                });

                $('input.uncontained').keyup(function () {

                    $('.contained').val('');
                    $('div.contained').find('.filter-col').each(function () {
                        if ($(this).hasClass('ntl-filter-hide')) {
                            $(this).removeClass('ntl-filter-hide');
                            $(this).removeClass('ntl-filter-show');
                        }
                    });

                    _filter_keyup_load(this, 'div.uncontained');
                });

                $('.contained .filter-col').click(function () {
                    $('.filter-col-highlight').each(function () {
                        $(this).removeClass('filter-col-highlight');
                    });
                    $(this).addClass('filter-col-highlight');
                });

                $('.uncontained .filter-col').click(function () {
                    $('.filter-col-highlight').each(function () {
                        $(this).removeClass('filter-col-highlight');
                    });
                    $(this).addClass('filter-col-highlight');
                });

                $('.apply-btn').click(function () {

                    var highCol = 0;
                    var issueDraw = false;

                    if ($('li.ntl-filter-show').length > 10) {

                        var colIx = parseInt($($('li.ntl-filter-show')[0]).attr('row-index'));
                        var searchTerms = [];

                        if ($.isNumeric(oldApply)) {
                            var columnOld = ntlTable.column(oldApply);
                            columnOld.search("").draw();
                        }

                        $('li.ntl-filter-show').each(function (ix) {
                            searchTerms.push($(this).find('a').text().toString());
                        });
                        ntlTable.column(colIx)
                            .search(searchTerms.join('|'), true, false)
                            .draw();

                        highCol++;
                        oldApply = colIx;
                    }

                    if ($('li.tab-uncontained').hasClass('active')) {
                        $('.filter-col-highlight').each(function () {
                            highCol++;
                            var column = ntlTable.column($(this).attr('row-index'));
                            column.search("^(?:(?!" + $(this).find('a').text().toString() + ").)*$\r?\n?", true, false).draw();
                            oldApply = $(this).attr('row-index');
                            if ($('.dataTables_empty').length !== 0) {
                                issueDraw = true;
                            }
                        });
                    } else {

                        $('.filter-col-highlight').each(function () {
                            highCol++;
                            var column = ntlTable.column($(this).attr('row-index'));
                            column.search($(this).children('a').text().toString()).draw();
                            oldApply = $(this).attr('row-index');
                            if ($('.dataTables_empty').length !== 0) {
                                issueDraw = true;
                            }
                        });

                    }

                    if (highCol === 0) {
                        var column = ntlTable.column($(this).attr('col-index'));
                        column.search("").draw();
                        if ($('.dataTables_empty').length !== 0) {
                            location.reload();
                        }
                    }

                    $('div.column-filter').hide();
                    $('div.column-filter').remove();

                    if (issueDraw) {
                        alert("Detected unavailable data in filter.");
                        location.reload();
                    }
                });

                $('.reset-btn').click(function () {

                    $('.ntl-filter-hide').each(function () {
                        $(this).removeClass('ntl-filter-hide');
                    });
                    var column = ntlTable.column($(this).attr('col-index'));
                    column.search("").draw();
                });
            });
        }

        //display and process filter tool
        loadFilter();

        $('.show-filter').click(function () {

            $('option.h-filter').each(function () {
                $(this).remove();
            });

            $.each(filterColIndex, function (iCol, val) {
                var colHead = $(ntlTable.column(val).header());
                if (colHead.find('i').length !== 0) {
                    colHead.find('i').remove();
                    var colTitle = colHead.html();
                } else
                    colTitle = colHead.html();
                $('.filter-checkbox').append('<option class="h-filter" value="' + val + '">' + colTitle + '</option>');
            });

            loadFilter();

            $('.filter-html').hide(300);

            $('.filter-html').show(400);

            if ($('.extra-col').length !== 0)
                $('.extra-col').hide(300);


            $('.filter-checkbox').on('select2:unselect', function (e) {
                var data = e.params.data;
                var filterIco = $(ntlTable.column(data.id).header());
                filterIco.find('.filter-ico').remove();
            });

        });

        //close filter widget
        $('.filter-close').click(function () {
            $('.filter-html').hide(400);
        });

        $('.reset-filter').click(function () {

            for (var ift in $('.filter-checkbox').select2('val')) {
                var filterIco = $(ntlTable.column(ift).header());
                filterIco.find('.filter-ico').remove();
            }

            $(".filter-checkbox > option").prop("selected", false);
            $(".filter-checkbox").trigger("change");
        });

        $('.all-filter').click(function () {

            $(".filter-checkbox > option").prop('selected', 'selected');
            $(".filter-checkbox").trigger('change');
            $(".filter-checkbox > option").each(function () {

                $(this).prop('selected', 'selected');
                var data = {
                    id: $(this).val(),
                    text: $(this).text(),
                }

                $(this).trigger({
                    type: "select2:select",
                    params: {
                        data: data
                    }
                });
            });
        });

        $('.filter-checkbox').on('select2:select', function (e) {

            var data = e.params.data;
            var filterIco = $(ntlTable.column(data.id).header());
            if (filterIco.find('.filter-ico').length === 0)
                filterIco.append('<i class="fa fa-filter filter-ico" data-toggle="tooltip" title="show filter"></i>');
            else {
                filterIco.find('.filter-ico').remove();
                filterIco.append('<i class="fa fa-filter filter-ico" data-toggle="tooltip" title="show filter"></i>');
            }

            filterProcess(filterIco);
        });

        //If nothing data
        if ($('.dataTables_empty').length !== 0) {
            $('.ttable').attr('data-toggle', 'tooltip');
            $('.ttable').attr('title', 'No available filter');
        }

        // Enable Tooltip
        $('[data-toggle="tooltip"]').tooltip();

        $('.save-filter').click(function (e) {

            $('.show-alert').each(function () {
                $(this).remove();
            });

            var sFCols = $('.filter-checkbox').select2("val");
            var saveFCols = {};

            saveFCols[activePage] = sFCols;

            // Save filter data
            var sRquest;

            $(this).prop("disabled", true);
            $('.reset-filter').attr("disabled", 'disabled');
            $('.all-filter').attr("disabled", 'disabled');
            $(this).html(`<i class="fa fa-spinner fa-spin" style="font-size: 0.6rem;"></i>`);

            sRquest = $.ajax({
                url: "/toolbar/toolbar.php",
                type: "post",
                data: {fStatus: true, sFilter: JSON.stringify(saveFCols)}
            });

            saveFCols = true;
            sRquest.done(function (response, textStatus, jqXHR) {

                $('.save-filter').prop("disabled", false);
                $('.reset-filter').removeAttr("disabled");
                $('.all-filter').removeAttr("disabled");

                $('.save-filter').text("Save");
                $('.save-filter').find('.fa-spinner').remove();

                saveFCols = false;

                var res = JSON.parse(response);

                for (let i = 0; i < res.length; i++) {

                    if ('error' in res[i]) {
                        $('#DataTables_Table_0_wrapper').prepend(errorAlert);
                        $('.error-msg').text(res[i]['message']);
                        $('.error-msg').removeClass('error-msg');
                        $(".error-alert").show();
                        $(".error-alert").addClass('show-alert');
                        $('.error-alert').removeClass('error-alert');

                    } else if ('success' in res[i]) {
                        $('#DataTables_Table_0_wrapper').prepend(successAlert);
                        $('.success-msg').text(res[i]['message']);
                        $('.success-msg').removeClass('success-msg');
                        $(".success-alert").show();
                        $(".success-alert").addClass('show-alert');
                        $('.success-alert').removeClass('success-alert');
                    }
                }
                setTimeout(function () {
                    $(".show-alert").hide(700)
                }, 5000);
            });
        });

        //Specification - valid domain module
        function checkDomain() {
            if ($('#domain').attr('valid') == 'ok') {
                $('input.formButton').each(function () {
                    if ($(this).val() == 'Add New Domain' || $(this).val() == 'Save Domain') {
                        $(this).prop('disabled', false);
                    }
                });
            } else {
                $('input.formButton').each(function () {
                    if ($(this).val() == 'Add New Domain' || $(this).val() == 'Save Domain') {
                        $(this).prop('disabled', true);
                    }
                });
            }
        }

        $('#domain').keyup(function () {
            checkDomain();
        });

        $('#domain').change(function () {
            checkDomain();
        });

        $('#attrs').keyup(function () {
            $('#domain').trigger('change');
        });

    });

} catch (e) {
    if ($('.ttable').length !== 0)
        alert(e + " Please check install guide. http://networklab.global/opensips/toolbar");
}

$(document).mouseout(function (e) {

    var menu = $('li.dropdown-submenu');
    var submenu = $('li.dropdown-submenu').children('ul');
    if (!menu.is(e.target)
        && menu.has(e.target).length === 0
        && !submenu.is(e.target)
        && submenu.has(e.target).length === 0
    ) {
        submenu.hide();
    }
});

$(document).mouseup(function (e) {

    var container = $('div.column-filter');

    if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.hide();
        container.remove();
    }

    var editContainer = $('.hide-menu');

    if (!editContainer.is(e.target) && editContainer.has(e.target).length === 0) {
        editContainer.hide();
        editContainer.remove();
    }

    $('.row-highlight').each(function () {
        if (!$('.hide-show').is(e.target) && $('.hide-show').has(e.target).length === 0
            && !$('.hide-show-i').is(e.target) && $('.hide-show-i').has(e.target).length === 0
            && !$('.column-trash').is(e.target) && $('.column-trash').has(e.target).length === 0
            && !$('.toolbar-button').is(e.target) && $('.toolbar-button').has(e.target).length === 0
            && !$('.column-edit').is(e.target) && $('.column-edit').has(e.target).length === 0
            && !$('.column-edit, .fa-edit').is(e.target) && $('.column-edit, .fa-edit').has(e.target).length === 0
            && !$('.column-trash, .fa-trash').is(e.target) && $('.column-trash, .fa-trash').has(e.target).length === 0)
            $(this).removeClass('row-highlight');
    });

});