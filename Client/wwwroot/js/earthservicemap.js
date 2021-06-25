var c_dKeepAliveLatitude = 42;
var c_dKeepAliveLongitude = -71;
var c_dUniqueGpsDistanceMiles = 3.0;    // no better way than to do this for now
var c_iDisplayGpsLength = 3;

var c_iPanelExpandedWidth = 305;

var m_oLocations = [];
var m_oMarkers = [];

var m_jqList;
var m_jqListHeader;
var m_jqListBody;
var m_jqMap;
var m_jqPanel;
var m_jqTab;

var m_bCollapsed;

function EarthServiceMap_Initialize() {
    m_jqList = $('#divList');
    m_jqListHeader = m_jqList.find('div.Header');
    m_jqListBody = m_jqList.find('div.Body');
    m_jqMap = $('#divMap');
    m_jqPanel = $('#divPanel');
    m_jqTab = $('#divTab');
    EarthServiceMap_FillLocations();
    EarthServiceMap_CreateMap();
    EarthServiceMap_CreateList();

    m_jqTab.on('click', function (event) {
        EarthServiceMap_TogglePanelCollapse();
    });

    m_jqMap.on('click', function (event) {
        if ($(window).width() < c_iPanelExpandedWidth * 2) {
            EarthServiceMap_TogglePanelCollapse(true);
        }
    });

    m_jqPanel.on('transitionend', function (event) {
        m_jqPanel.removeClass('Animate');
    });
    m_jqTab.on('transitionend', function (event) {
        m_jqTab.removeClass('Animate');
    });
    m_jqList.on('transitionend', function (event) {
        m_jqList.removeClass('Animate');
    });

    $('#divPopUpBackground').on('click', function (event) {
        HideAllPopups();
    });

    EarthServiceMap_TogglePanelCollapse(false);
    $(window).trigger('resize');
}

$(window).resize(function () {
    if ($('#divEarthServiceMap').length == 0) { return; }

    var iWindowHeight = $(window).height() - OffsetBottom('div.main > div.top-row');
    var iWindowWidth = $(window).width();
    var iPadding = 5;

    m_jqPanel.css('height', iWindowHeight + 'px');
    m_jqListBody.css('height', iWindowHeight - m_jqListHeader.outerHeight(true) - iPadding + 'px');
    //m_jqPanel.css('height', iWindowHeight + 'px').css('width', c_iPanelExpandedWidth + 'px');    
    //m_jqTab.css('left', c_iPanelExpandedWidth + 'px');

    m_jqMap.css('height', iWindowHeight + 'px').css('width', iWindowWidth + 'px');
    HideAllPopups();
});

function EarthServiceMap_TogglePanelCollapse(i_bCollapse_Optional) {
    if (i_bCollapse_Optional == null) { i_bCollapse_Optional = !m_bCollapsed; }

    m_jqPanel.addClass('Animate');
    m_jqList.addClass('Animate');
    m_jqTab.addClass('Animate');

    if (i_bCollapse_Optional) {
        m_jqPanel.css('width', 0 + 'px');
        m_jqTab.css('left', 0 + 'px');
        m_jqList.css('left', -1 * c_iPanelExpandedWidth + 'px');
        m_jqTab.html('&#10096;');
        m_bCollapsed = true;
    } else {
        m_jqPanel.css('width', c_iPanelExpandedWidth + 'px');
        m_jqTab.css('left', c_iPanelExpandedWidth + 'px');
        m_jqList.css('left', 0 + 'px');
        m_jqTab.html('&#10097;');
        m_bCollapsed = false;
    }
}

function EarthServiceMap_CreateMap() {
    //https://stackoverflow.com/questions/3059044/google-maps-js-api-v3-simple-multiple-marker-example           
    var map = new google.maps.Map(document.getElementById('divMap'), {
        zoom: 5,
        center: new google.maps.LatLng(37.0902, -95.7129),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        gestureHandling: "greedy"
    });

    var infowindow = new google.maps.InfoWindow();

    for (var i = 0; i < m_oLocations.length; i++) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(m_oLocations[i].latitude, m_oLocations[i].longitude),
            map: map
        });

        m_oMarkers[i] = marker;

        google.maps.event.addListener(marker, 'click', (function (marker, i) {
            return function () {
                infowindow.setContent('<b>' + m_oLocations[i].number + '.</b> ' + EarthServiceMap_LocationDescription(m_oLocations[i]));
                infowindow.open(map, marker);
            }
        })(marker, i));
    }
}

function EarthServiceMap_CreateList() {
    for (var i = 0; i < m_oLocations.length; i++) {
        var jqItem = $('<table class="ItemTable"><tr>'
            + '<td class="Id Clickable"><b>' + m_oLocations[i].number + '.</b><div class="Popup">' + m_oLocations[i].responseString + '</div></td>'
            + '<td class="Description Clickable">' + EarthServiceMap_LocationDescription(m_oLocations[i]) + '</td>'
            + '<td>' + EarthServiceMap_UnixTimeStampToDateString(m_oLocations[i].time) + '</td>'
            + '<td>' + m_oLocations[i].version + '</td>'
            + '<td class="Duration Clickable">' + m_oLocations[i].duration + ' s<div class="Popup">' + m_oLocations[i].timingString + '</div></td>'
            + '</tr></table>');
        jqItem.find('td.Description').on('click', function () {
            var iIndex = $(this).parents('table.ItemTable').index();
            google.maps.event.trigger(m_oMarkers[iIndex], 'click');
            if ($(window).width() < c_iPanelExpandedWidth * 2) {
                EarthServiceMap_TogglePanelCollapse();
            }
        });
        jqItem.find('td.Duration').on('click', function () {
            PopupHandler($(this), true);
        });
        jqItem.find('td.Id').on('click', function () {
            PopupHandler($(this), false);
        });
        m_jqListBody.append(jqItem);
    }
}

function PopupHandler(i_jqTableCell, i_bLeft) {
    var c_iPadding = 5;
    var jqPopup = i_jqTableCell.find('div.Popup');
    var jqPosition = i_jqTableCell.offset();
    jqPopup.show();
    jqPopup.css('max-height', '');
    jqPopup.css('top', jqPosition.top + i_jqTableCell.outerHeight(true) + 'px');
    if (i_bLeft) {
        jqPopup.css('left', jqPosition.left - jqPopup.outerWidth(true) + 'px');
    } else {
        jqPopup.css('left', jqPosition.left + i_jqTableCell.outerWidth(true) + 'px');
    }

    var iPopupBelowWindow = jqPopup.offset().top + jqPopup.outerHeight(true) - $(window).innerHeight();
    if (iPopupBelowWindow > 0) {
        var iMinTop = $('#divList div.Header').outerHeight(true);
        jqPopup.css('top', Math.max(iMinTop + c_iPadding, jqPopup.offset().top - iPopupBelowWindow - c_iPadding) + 'px');
        jqPopup.css('max-height', $(window).innerHeight() - iMinTop - c_iPadding * 4 + 'px');
    }
    $('#divPopUpBackground').show();
    EarthServiceMap_EnableDisableScrolling($('#divList div.Body'), false);
}

function EarthServiceMap_HtmlEncodeJavascriptString(i_sText) {
    i_sText = i_sText.replace(/\r\n/g, '<br>');
    i_sText = i_sText.replace(/\n/g, '<br>');
    i_sText = i_sText.replace(/  /g, '&nbsp;&nbsp;')
    return i_sText;
}

function HideAllPopups() {
    $('div.Popup').hide();
    $('#divPopUpBackground').hide();
    EarthServiceMap_EnableDisableScrolling($('#divList div.Body'), true);
}

function EarthServiceMap_EnableDisableScrolling(i_jqElement, i_bEnable) {
    var sDisableScrollClass = "DisableScroll";
    if (!i_bEnable) {
        i_jqElement.addClass(sDisableScrollClass);
    } else {
        i_jqElement.removeClass(sDisableScrollClass);
    }
}

function EarthServiceMap_FillLocations() {
    m_oLocations = [];
    try {
        var oInvocations = JSON.parse($('#txtInvocations').val());
        for (var i = 0; i < oInvocations.length; i++) {
            var iIndex = -1;
            if (EarthServiceMap_IsKeepAlive(oInvocations[i])) { continue; }
            for (var j = 0; j < m_oLocations.length; j++) {
                if (Math.abs(EarthServiceMap_DistanceInMiles(oInvocations[i].latitude, oInvocations[i].longitude, m_oLocations[j].latitude, m_oLocations[j].longitude)) < c_dUniqueGpsDistanceMiles) {
                    iIndex = j;
                    break;
                }
            }
            if (iIndex < 0) {
                iIndex = m_oLocations.length;
                m_oLocations[iIndex] = {
                    "number": iIndex + 1,
                    "latitude": oInvocations[i].latitude,
                    "longitude": oInvocations[i].longitude,
                    "count": 0,
                    "duration": 0,
                    "version": oInvocations[i].version,
                    "time": oInvocations[i].time,
                    "timing": oInvocations[i].timing,
                    "timingString": '',
                    "response": oInvocations[i].response,
                    "responseString": ''
                };
            }
            m_oLocations[iIndex].count += 1;
            m_oLocations[iIndex].duration = Math.max(m_oLocations[iIndex].duration, oInvocations[i].duration);
            m_oLocations[iIndex].time = Math.min(m_oLocations[iIndex].time, oInvocations[i].time);
            if (m_oLocations[iIndex].timingString != '') { m_oLocations[iIndex].timingString += '<br>'; }
            m_oLocations[iIndex].timingString += EarthServiceMap_HtmlEncodeJavascriptString(oInvocations[i].timing);
            if (m_oLocations[iIndex].responseString != '') { m_oLocations[iIndex].responseString += '<br><br>'; }
            m_oLocations[iIndex].responseString += EarthServiceMap_HtmlEncodeJavascriptString(oInvocations[i].response);
        }
    } catch (err) {
        m_oLocations = [];
    }
}

function EarthServiceMap_IsKeepAlive(i_oInvocation) {
    if (i_oInvocation.latitude.toFixed(c_iDisplayGpsLength) == c_dKeepAliveLatitude.toFixed(c_iDisplayGpsLength) &&
        i_oInvocation.longitude.toFixed(c_iDisplayGpsLength) == c_dKeepAliveLongitude.toFixed(c_iDisplayGpsLength)) {
        return true;
    }
    return false;
}

function EarthServiceMap_LocationDescription(i_oLocation) {
    var sDescription = i_oLocation.latitude.toFixed(c_iDisplayGpsLength) + ', ' + i_oLocation.longitude.toFixed(c_iDisplayGpsLength);
    if (i_oLocation.count > 1) {
        sDescription += ' (' + i_oLocation.count + ')';
    }
    return sDescription;
}

//https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
function EarthServiceMap_DistanceInMiles(i_dLatitude1, i_dLongitude1, i_dLatitude2, i_dLongitude2) {
    var R = 6371; // Radius of the earth in km
    var dLat = EarthServiceMap_DegreesToRadians(i_dLatitude2 - i_dLatitude1);  // deg2rad below
    var dLon = EarthServiceMap_DegreesToRadians(i_dLongitude2 - i_dLongitude1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(EarthServiceMap_DegreesToRadians(i_dLatitude1)) * Math.cos(EarthServiceMap_DegreesToRadians(i_dLatitude2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d * 0.62137; // convert to miles    
}

function EarthServiceMap_DegreesToRadians(i_dDegrees) {
    return i_dDegrees * (Math.PI / 180)
}

function EarthServiceMap_UnixTimeStampToDateString(i_iTimeStamp) {
    var dtDate = new Date(i_iTimeStamp * 1000);
    var iHours = (dtDate.getHours() + 11) % 12 + 1;
    var sMinutes = "0" + dtDate.getMinutes();
    var sSeconds = "0" + dtDate.getSeconds();

    return iHours + ':' + sMinutes.substr(-2) + ':' + sSeconds.substr(-2);
}