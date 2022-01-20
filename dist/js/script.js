document.addEventListener("DOMContentLoaded", function() {
    // Get the canvas element from the DOM
    const canvas = document.querySelector('#scene');
    // canvas.width = canvas.clientWidth;
    // canvas.height = canvas.clientHeight;

    if (canvas != null) {

        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        // Store the 2D context
        const ctx = canvas.getContext('2d');

        if (window.devicePixelRatio > 1) {
            canvas.width = canvas.offsetWidth * 2;
            canvas.height = canvas.offsetWidth * 2;
            ctx.scale(2, 2);
        }

        /* ====================== */
        /* ====== VARIABLES ===== */
        /* ====================== */
        let width = canvas.clientWidth; // Width of the canvas
        let height = canvas.clientHeight; // Height of the canvas
        let rotation = 0; // Rotation of the globe
        let dots = []; // Every dots in an array

        /* ====================== */
        /* ====== CONSTANTS ===== */
        /* ====================== */
        /* Some of those constants may change if the user resizes their screen but I still strongly believe they belong to the Constants part of the variables */
        const DOTS_AMOUNT = 1000; // Amount of dots on the screen
        const DOT_RADIUS = 4; // Radius of the dots
        let GLOBE_RADIUS = width * 0.7; // Radius of the globe
        let GLOBE_CENTER_Z = -GLOBE_RADIUS; // Z value of the globe center
        let PROJECTION_CENTER_X = width / 2; // X center of the canvas HTML
        let PROJECTION_CENTER_Y = height / 2; // Y center of the canvas HTML
        let FIELD_OF_VIEW = width * 0.8;

        class Dot {
        constructor(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            
            this.xProject = 0;
            this.yProject = 0;
            this.sizeProjection = 0;
        }
        // Do some math to project the 3D position into the 2D canvas
        project(sin, cos) {
            const rotX = cos * this.x + sin * (this.z - GLOBE_CENTER_Z);
            const rotZ = -sin * this.x + cos * (this.z - GLOBE_CENTER_Z) + GLOBE_CENTER_Z;
            this.sizeProjection = FIELD_OF_VIEW / (FIELD_OF_VIEW - rotZ);
            this.xProject = (rotX * this.sizeProjection) + PROJECTION_CENTER_X;
            this.yProject = (this.y * this.sizeProjection) + PROJECTION_CENTER_Y;
        }
        // Draw the dot on the canvas
        draw(sin, cos) {
            this.project(sin, cos);
            // ctx.fillRect(this.xProject - DOT_RADIUS, this.yProject - DOT_RADIUS, DOT_RADIUS * 2 * this.sizeProjection, DOT_RADIUS * 2 * this.sizeProjection);
            ctx.beginPath();
            ctx.arc(this.xProject, this.yProject, DOT_RADIUS * this.sizeProjection, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        }

        function createDots() {
        // Empty the array of dots
        dots.length = 0;
        
        // Create a new dot based on the amount needed
        for (let i = 0; i < DOTS_AMOUNT; i++) {
            const theta = Math.random() * 2 * Math.PI; // Random value between [0, 2PI]
            const phi = Math.acos((Math.random() * 2) - 1); // Random value between [-1, 1]
            
            // Calculate the [x, y, z] coordinates of the dot along the globe
            const x = GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta);
            const y = GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta);
            const z = (GLOBE_RADIUS * Math.cos(phi)) + GLOBE_CENTER_Z;
            dots.push(new Dot(x, y, z));
        }
        }

        /* ====================== */
        /* ======== RENDER ====== */
        /* ====================== */
        function render(a) {
        // Clear the scene
        ctx.clearRect(0, 0, width, height);
        
        // Increase the globe rotation
        rotation = a * 0.0004;
        
        const sineRotation = Math.sin(rotation); // Sine of the rotation
        const cosineRotation = Math.cos(rotation); // Cosine of the rotation
        
        // Loop through the dots array and draw every dot
        for (var i = 0; i < dots.length; i++) {
            dots[i].draw(sineRotation, cosineRotation);
        }
        
        window.requestAnimationFrame(render);
        }


        // Function called after the user resized its screen
        function afterResize () {
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        if (window.devicePixelRatio > 1) {
            canvas.width = canvas.clientWidth * 2;
            canvas.height = canvas.clientHeight * 2;
            ctx.scale(2, 2);
        } else {
            canvas.width = width;
            canvas.height = height;
        }
        GLOBE_RADIUS = width * 0.7;
        GLOBE_CENTER_Z = -GLOBE_RADIUS;
        PROJECTION_CENTER_X = width / 2;
        PROJECTION_CENTER_Y = height / 2;
        FIELD_OF_VIEW = width * 0.8;
        
        createDots(); // Reset all dots
        }

        // Variable used to store a timeout when user resized its screen
        let resizeTimeout;
        // Function called right after user resized its screen
        function onResize () {
        // Clear the timeout variable
        resizeTimeout = window.clearTimeout(resizeTimeout);
        // Store a new timeout to avoid calling afterResize for every resize event
        resizeTimeout = window.setTimeout(afterResize, 500);
        }
        window.addEventListener('resize', onResize);

        // Populate the dots array with random dots
        createDots();

        // Render the scene
        window.requestAnimationFrame(render);
    }


    //BTN-MAGIC
    document.addEventListener("mousemove", function (e) {
        let element = e.target;
        if (element.closest(".btn-magic-wrapper")) {
            let elWrap = element.closest(".btn-magic-wrapper");
            if (!elWrap.classList.contains("--add")) {
                let $circlesTopLeft = elWrap.querySelectorAll(".circle.top-left");
                let $circlesBottomRight = elWrap.querySelectorAll(".circle.bottom-right");

                let tl = new TimelineLite();
                let tl2 = new TimelineLite();
                let btTl = new TimelineLite({ paused: true });

                tl.to($circlesTopLeft, 1.2, { x: -25, y: -25, scaleY: 2, ease: SlowMo.ease.config(0.1, 0.7, false) });
                tl.to($circlesTopLeft[0], 0.1, { scale: 0.2, x: "+=6", y: "-=2" });
                tl.to($circlesTopLeft[1], 0.1, { scaleX: 1, scaleY: 0.8, x: "-=10", y: "-=7" }, "-=0.1");
                tl.to($circlesTopLeft[2], 0.1, { scale: 0.2, x: "-=15", y: "+=6" }, "-=0.1");
                tl.to($circlesTopLeft[0], 1, { scale: 0, x: "-=5", y: "-=15", opacity: 0 });
                tl.to($circlesTopLeft[1], 1, { scaleX: 0.4, scaleY: 0.4, x: "-=10", y: "-=10", opacity: 0 }, "-=1");
                tl.to($circlesTopLeft[2], 1, { scale: 0, x: "-=15", y: "+=5", opacity: 0 }, "-=1");

                let tlBt1 = new TimelineLite();
                let tlBt2 = new TimelineLite();

                tlBt1.set($circlesTopLeft, { x: 0, y: 0, rotation: -45 });
                tlBt1.add(tl);

                tl2.set($circlesBottomRight, { x: 0, y: 0 });
                tl2.to($circlesBottomRight, 1.1, { x: 30, y: 30, ease: SlowMo.ease.config(0.1, 0.7, false) });
                tl2.to($circlesBottomRight[0], 0.1, { scale: 0.2, x: "-=6", y: "+=3" });
                tl2.to($circlesBottomRight[1], 0.1, { scale: 0.8, x: "+=7", y: "+=3" }, "-=0.1");
                tl2.to($circlesBottomRight[2], 0.1, { scale: 0.2, x: "+=15", y: "-=6" }, "-=0.2");
                tl2.to($circlesBottomRight[0], 1, { scale: 0, x: "+=5", y: "+=15", opacity: 0 });
                tl2.to($circlesBottomRight[1], 1, { scale: 0.4, x: "+=7", y: "+=7", opacity: 0 }, "-=1");
                tl2.to($circlesBottomRight[2], 1, { scale: 0, x: "+=15", y: "-=5", opacity: 0 }, "-=1");

                tlBt2.set($circlesBottomRight, { x: 0, y: 0, rotation: 45 });
                tlBt2.add(tl2);

                btTl.add(tlBt1);
                btTl.to(elWrap.querySelectorAll(".button.effect-button"), 0.8, { scaleY: 1.1 }, 0.1);
                btTl.add(tlBt2, 0.2);
                btTl.to(elWrap.querySelectorAll(".button.effect-button"), 1.8, { scale: 1, ease: Elastic.easeOut.config(1.2, 0.4) }, 1.2);

                btTl.timeScale(2.6);

                elWrap.classList.add("--add");

                elWrap.addEventListener("mouseenter", () => {
                    btTl.restart();
                });

                btTl.restart();
            }
        }
    });


    let arrCardCaseSmall = document.querySelectorAll(".card-case-small");

    arrCardCaseSmall.forEach((element) => {
        let elIcon = element.querySelector(".card-case-small__image img");

        let parallaxInstance = new Parallax(element, {
            hoverOnly: true,
            pointerEvents: true,
            selector: ".card-case-small__image img",
        });
    });


}, false)