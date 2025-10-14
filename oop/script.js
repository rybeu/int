//1
class KontoBankowe {
  #saldo;

  constructor(saldoPoczatkowe = 0) {
    this.#saldo = saldoPoczatkowe;
  }

  deposit(amount) {
    this.#saldo += amount;
  }

  withdraw(amount) {
    if (amount > this.#saldo) {
      console.log("Niewystarczające środki");
      return;
    }
    this.#saldo -= amount;
  }

  get saldo() {
    return this.#saldo;
  }
}

const konto = new KontoBankowe(500);
konto.deposit(200);
konto.withdraw(100);
console.log(konto.saldo);

//2
class Osoba {
  static przedstaw(imie, nazwisko) {
    if (imie && nazwisko) return `Nazywam się ${imie} ${nazwisko}`;
    if (imie) return `Mam na imię ${imie}`;
    return "Brak danych";
  }
}

console.log(Osoba.przedstaw("Anna"));
console.log(Osoba.przedstaw("Anna", "Kowal"));
console.log(Osoba.przedstaw());

//3
const Osoba2 = {
  przywitaj() {
    return `Cześć, jestem ${this.imie}`;
  }
};

function Uczen(imie, oceny = []) {
  this.imie = imie;
  this.oceny = oceny;
}

Uczen.prototype = Object.create(Osoba);
Uczen.prototype.constructor = Uczen;

Uczen.prototype.srednia = function() {
  if (this.oceny.length === 0) return 0;
  const suma = this.oceny.reduce((a, b) => a + b, 0);
  return suma / this.oceny.length;
};

const uczen = new Uczen("Anna", [5, 4, 3]);    
console.log(uczen.srednia());


//4
class SrodekTransportu {
  constructor() {
    if (new.target === SrodekTransportu) {
      throw new Error("Nie można tworzyć instancji klasy abstrakcyjnej");
    }
  }

  poruszajSie() {
    throw new Error("Metoda musi być zaimplementowana w klasie pochodnej");
  }
}

class Samolot extends SrodekTransportu {
  poruszajSie() {
    return "Samolot leci";
  }
}

class Auto extends SrodekTransportu {
  poruszajSie() {
    return "Auto jedzie";
  }
}

class Lodz extends SrodekTransportu {
  poruszajSie() {
    return "Łódź płynie";
  }
}

console.log(new Samolot().poruszajSie());
console.log(new Auto().poruszajSie());
console.log(new Lodz().poruszajSie());


//5
class Psowate {
  dajGlos() {}
}

class Szczeniak extends Psowate {
  dajGlos() { return "Hał hał (po szczenięcemu)"; }
}

class Pies extends Psowate {
  dajGlos() { return "Hał hał"; }
}

class Wilk extends Psowate {
  dajGlos() { return "Auuuu"; }
}

const PsowateProto = { dajGlos() { return "Dźwięk psowatego"; } };
const SzczeniakProto = Object.create(PsowateProto, {
  dajGlos: { value: function() { return "Hał hał (po szczenięcemu)"; } }
});
const PiesProto = Object.create(PsowateProto, {
  dajGlos: { value: function() { return "Hał hał"; } }
});
const WilkProto = Object.create(PsowateProto, {
  dajGlos: { value: function() { return "Auuuu"; } }
});

[new Szczeniak(), new Pies(), new Wilk(),
 SzczeniakProto, PiesProto, WilkProto].forEach(z => console.log(z.dajGlos()));



//6
class Artysta {
  constructor() {
    if (new.target === Artysta) {
      throw new Error("Nie można utworzyć instancji klasy abstrakcyjnej");
    }
  }

  tworzDzielo() {
    throw new Error("Metoda abstrakcyjna");
  }

  kontempluj() {
    return "Kontempluje nad sztuką...";
  }
}

class Rzezbiarz extends Artysta {
  tworzDzielo() { return "Rzeźbi w kamieniu"; }
}

class Malarz extends Artysta {
  tworzDzielo() { return "Maluje obraz"; }
}

class Pisarz extends Artysta {
  tworzDzielo() { return "Pisze książkę"; }
}

const artysci = [new Rzezbiarz(), new Malarz(), new Pisarz()];
artysci.forEach(a => console.log(`${a.tworzDzielo()} | ${a.kontempluj()}`));


//7
class KalkulatorProsty {
  static dodaj(a, b) { return a + b; }
  static odejmij(a, b) { return a - b; }
  static mnoz(a, b) { return a * b; }
  static dziel(a, b) {
    if (b === 0) throw new Error("Nie można dzielić przez zero");
    return a / b;
  }
}

console.log(KalkulatorProsty.dodaj(5, 3));
console.log(KalkulatorProsty.mnoz(4, 6));
