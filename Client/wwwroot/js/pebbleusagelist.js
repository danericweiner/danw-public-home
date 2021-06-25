var m_jqPanel;
var m_jqList;
var m_jqListHeader;
var m_jqListBody;

var m_bCollapsed;

function PebbleUsageList_Initialize() {
    m_jqPanel = $('#divPanel');
    m_jqList = $('#divList');
    m_jqListHeader = m_jqList.find('div.Header');
    m_jqListBody = m_jqList.find('div.Body');
    PebbleUsageList_CreateList();

    $(window).trigger('resize');
};

$(window).resize(function () {
    if ($('#divPebbleUsageList').length == 0) { return; }

    var iWindowHeight = $(window).height() - OffsetBottom('div.main > div.top-row');
    var iWindowWidth = $('div.content').outerWidth();
    var iPadding = 5;

    m_jqPanel.css('height', iWindowHeight + 'px');
    m_jqPanel.css('left', Math.max(0, (iWindowWidth - m_jqPanel.outerWidth(true)) / 2) + 'px');
    m_jqListBody.css('height', iWindowHeight - m_jqListHeader.outerHeight(true) - iPadding + 'px');

});

function PebbleUsageList_CreateList() {
    var oInvocations = JSON.parse($('#txtInvocations').val());
    try {
        for (var i = 0; i < oInvocations.length; i++) {
            var jqItem = $('<table class="ItemTable"><tr><td><b>' + (i + 1) + '.</b></td>'
                + '<td id="tdIPAddress">' + oInvocations[i].ipAddress + '</td>'
                + '<td>' + PebbleUsageList_UnixTimeStampToDateString(oInvocations[i].time) + '</td>'
                + '</tr></table>');
            jqItem.on('click', function () {
                var sIPAddress = $(this).find('#tdIPAddress').text();
                window.open(PebbleUsageList_Link(sIPAddress), '_blank');
            });
            m_jqListBody.append(jqItem);
        }
    } catch (err) {
    }
}

function PebbleUsageList_Link(i_sIPAddress) {
    return "https://whatismyipaddress.com/ip/" + i_sIPAddress;
}

function PebbleUsageList_UnixTimeStampToDateString(i_iTimeStamp) {
    var dtDate = new Date(i_iTimeStamp * 1000);
    return strftime("%n/%e/%Y %l:%M%p", dtDate).toLowerCase();
}