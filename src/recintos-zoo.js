class RecintosZoo {

    recintos = [
        {numero: 1, bioma: "savana", tamanhoTotal: 10, animaisExistentes: [{especie: "MACACO", quantidade: 3}], espacoExtra: 0}, 
        {numero: 2, bioma: "floresta", tamanhoTotal: 5, animaisExistentes: [], espacoExtra: 0}, 
        {numero: 3, bioma: "savana e rio", tamanhoTotal: 7, animaisExistentes: [{especie: "GAZELA", quantidade: 1}], espacoExtra: 0}, 
        {numero: 4, bioma: "rio", tamanhoTotal: 8, animaisExistentes: [], espacoExtra: 0},
        {numero: 5, bioma: "savana", tamanhoTotal: 9, animaisExistentes: [{especie: "LEAO", quantidade: 1}], espacoExtra: 0}
    ];

    animaisPossiveis = {
        "LEAO": { tamanho: 3, biomas: ["savana"], carnivoro: true },
        "LEOPARDO": { tamanho: 2, biomas: ["savana"], carnivoro: true },
        "CROCODILO": { tamanho: 3, biomas: ["rio"], carnivoro: true },
        "MACACO": { tamanho: 1, biomas: ["savana", "floresta"], carnivoro: false },
        "GAZELA": { tamanho: 2, biomas: ["savana"], carnivoro: false },
        "HIPOPOTAMO": { tamanho: 4, biomas: ["savana", "rio"], carnivoro: false }
    };

    analisaRecintos(animal, quantidade) {

        animal = animal.toUpperCase(); // Padroniza os nomes dos animais

        if (!this.animaisPossiveis[animal]) {
            return { erro: "Animal inválido" }; // Verifica se o animal está na lista de animais possiveis
        }

        if (typeof quantidade !== "number" || quantidade <= 0) {
            return { erro: "Quantidade inválida" }; // Verifica se a quantidade é valida
        }

        const animalInfo = this.animaisPossiveis[animal];
        const tamanhoTotal = animalInfo.tamanho * quantidade;
        const biomasPossiveis = animalInfo.biomas;
        
        const recintosViaveis = this.recintos.filter((recinto) => {

            // Um animal se sente confortável se está num bioma adequado e com espaço suficiente para cada indivíduo

            const espacoOcupado = recinto.animaisExistentes.reduce((total, { especie, quantidade }) => {
                return total + this.animaisPossiveis[especie].tamanho * quantidade; // Calcula a ocupação do bioma
            }, 0);

            // Quando há mais de uma espécie no mesmo recinto, é preciso considerar 1 espaço extra ocupado

            if (recinto.animaisExistentes.length > 0 && recinto.animaisExistentes[0].especie !== animal) {
                recinto.espacoExtra = 1;
            }
            
            const espacoLivre = recinto.tamanhoTotal - espacoOcupado - recinto.espacoExtra; // Calcula o espaço livre no bioma
            
            if (tamanhoTotal > espacoLivre) return false; // Verifica o espaço disponivel no bioma

            const biomasRecinto = recinto.bioma.split(" ");

            if (!biomasRecinto.some(b => biomasPossiveis.includes(b))) return false; // Verifica o bioma adequado para o animal

            // Animais carnívoros devem habitar somente com a própria espécie

            if (recinto.animaisExistentes.length > 0) {    
                if (animalInfo.carnivoro && recinto.animaisExistentes[0].especie !== animal) return false; 

                const animalExistenteCarnivoro = this.animaisPossiveis[recinto.animaisExistentes[0].especie].carnivoro;

                if (animalExistenteCarnivoro &&  animalInfo.carnivoro == false) return false;

                // Hipopótamo(s) só tolera(m) outras espécies estando num recinto com savana e rio
    
                if (animal === "HIPOPOTAMO" && recinto.animaisExistentes[0].especie !== animal && recinto.bioma != "savana e rio") return false;
            }

            // Um macaco não se sente confortável sem outro animal no recinto, seja da mesma ou outra espécie
            if (animal === "MACACO" && quantidade === 1 && recinto.animaisExistentes.length === 0) return false;


            return true;
        }
        );

        if (recintosViaveis.length === 0){
            return { erro: "Não há recinto viável" };
        }

        return {
            recintosViaveis: recintosViaveis.map(recinto => {
                const espacoOcupado = recinto.animaisExistentes.reduce((total, { especie, quantidade }) => {
                    return total + this.animaisPossiveis[especie].tamanho * quantidade; // Calcula a ocupação do bioma
                }, 0);
                
                const espacoLivre = recinto.tamanhoTotal -espacoOcupado -tamanhoTotal -recinto.espacoExtra;

                return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`; // Formatação da mensagem
            })
        };          
    }

}

export { RecintosZoo as RecintosZoo };
