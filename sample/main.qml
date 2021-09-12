import QtQuick 2.12
import QtQuick.Window 2.12

Window {
    width: 800
    height: 480
    visible: true
    title: qsTr("Hello World")



    Rectangle {
        id: window
        color: "black"
        width: 800
        height: 400

        Canvas {
            id: canvas
            anchors.fill: parent
            smooth: true
            onPaint: {
                var context = canvas.getContext("2d")
                context.clearRect(0, 0, width, height)
                context.strokeStyle = "white"
                context.path = pathInterpolator.path
                context.stroke()
            }
        }

        Image {
            id : rocket
            source : "rocket.png"
            x: pathInterpolator.x - width/2
            y: pathInterpolator.y - height/2
            rotation: pathInterpolator.angle + 90
        }

        PathInterpolator {
            id: pathInterpolator

            path: Path {
                startX: 100; startY: window.height/2

                PathCubic {
                    x: window.width - 100
                    y: window.height/2
                    control1X: 100; control1Y: 0
                    control2X: x; control2Y: window.height
                }

                PathCubic {
                    x: 100
                    y: window.height/2
                    control1X: window.width - 100; control1Y: 0
                    control2X: x; control2Y: window.height
                }
            }

            NumberAnimation on progress {
                running: true
                duration: 3000
                loops: 10
                from: 0
                to: 1
            }
        }
}
}
