/**
 * Created by beiwan on 2017/12/29.
 */
var jumpPoint = [];
var jumpTip = ['起点', '终点']
var $log = $('#log')
var $screen = $('#screencap')
function jump(event) {
    var data = getXAndY(event);
    var x = data.x;
    var y = data.y;

    if (jumpPoint.length === 0) {
        $log.html('')
    }

    jumpPoint.push({x: x, y: y})

    $log.append(jumpTip[jumpPoint.length - 1] + "：" + y + " , " + x + '<br/>');


    if (jumpPoint.length === 2) {
        var start = jumpPoint[0]
        var end = jumpPoint[1]
        var distance = Math.sqrt(Math.pow((start.x - end.x), 2) + Math.pow((start.y - end.y), 2));

        $log.append('发送模拟点击...<br/>')

        $.ajax({
                url: 'http://localhost:3000/jumponejump/',
                type: 'POST',
                dataType: 'json',
                data: {
                    distance: distance
                },
                success: function (result) {
                    $log.append(result.error ? '环境没配对吧，我这里是好的' : 'yeah!')
                    setTimeout(function () {
                        $screen.attr('src', '/images/jump_screencap/screencap.png?v=' + Math.random())

                    }, 4000)
                }
            })

        jumpPoint.length = 0
    }

}


function f5() {

    jumpPoint.length = 0
    $.ajax({
            url: 'http://localhost:3000/jumponejump/f5',
            type: 'POST',
            dataType: 'json',
            data: {

            },
            success: function (result) {
                $log.append(result.error ? '环境没配对吧，我这里是好的' : '刷新成功!')
                setTimeout(function () {
                    $screen.attr('src', '/images/jump_screencap/screencap.png?v=' + Math.random())

                }, 2000)
            }
        })
}


function getXAndY(event) {
    event = event || window.event;
    var mousePos = mouseCoords(event);
    var x = mousePos.x;
    var y = mousePos.y;

    var x1 = $("#screencap_box").offset().left;
    var y1 = $("#screencap_box").offset().top;

    var x2 = x - x1;
    var y2 = y - y1;
    return {x: x2, y: y2};
}

function mouseCoords(event) {
    if (event.pageX || event.pageY) {
        return {x: event.pageX, y: event.pageY};
    }
    return {
        x: event.clientX + document.body.scrollLeft - document.body.clientLeft,
        y: event.clientY + document.body.scrollTop - document.body.clientTop
    };
}
