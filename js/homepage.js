//reveals
const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", function () {

    reveals.forEach(function (section) {

        const top = section.getBoundingClientRect().top;

        const screenHeight = window.innerHeight;

        if (top < screenHeight - 100) {

            section.classList.add("active");

        }

    });

});
//counters
const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            const counter = entry.target;
            const target = +counter.dataset.target;

            let count = 0;

            const update = () => {

                count += Math.ceil(target / 100);

                if(count < target){

                    counter.innerText = count;

                    requestAnimationFrame(update);

                }else{

                    counter.innerText = target + "+";

                }

            };

            update();

            counterObserver.unobserve(counter);

        }

    });

});

counters.forEach(counter => {

    counterObserver.observe(counter);

});
//faq
const questions = document.querySelectorAll(".faq-question");

questions.forEach(question => {

    question.addEventListener("click", () => {

        const answer = question.nextElementSibling;

        if(answer.style.maxHeight){

            answer.style.maxHeight = null;

        }else{

            answer.style.maxHeight = answer.scrollHeight + "px";

        }

    });

});