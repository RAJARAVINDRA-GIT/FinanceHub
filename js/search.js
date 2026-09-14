const searchInput = document.getElementById(
    "calculatorSearch"
);


const cards = document.querySelectorAll(
    ".calculator-card"
);


if(searchInput){

    searchInput.addEventListener(
        "keyup",
        function(){

            const searchValue =
            searchInput.value.toLowerCase();


            cards.forEach(card => {

                const name =
                card.dataset.name;


                if(name.includes(searchValue)){

                    card.style.display="block";

                }
                else{

                    card.style.display="none";

                }

            });


        }
    );

}