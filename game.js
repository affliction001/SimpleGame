'use strict';

/*
Необходимо реализовать класс `Vector`, который позволит контролировать расположение объектов в двумерном пространстве
и управлять их размером и перемещением.
*/

class Vector {
	/*
	Конструктор:
		Принимает два аргумента — координаты по оси X и по оси Y, _числа_, по умолчанию `0`.
		Создает объект со свойствами `x` и `y`, равными переданным в конструктор координатам.
	*/

	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	/*
	Метод `plus`:
		Принимает один аргумент — вектор, _объект_ `Vector`.
		Если передать аргумент другого типа, то бросает исключение `Можно прибавлять к вектору только вектор типа Vector`.
		Создает и возвращает новый _объект_ типа `Vector`, координаты которого будут суммой соответствующих координат суммируемых векторов.
	*/
	
	plus(vector) {
		if (vector instanceof Vector) {
			return new Vector(this.x + vector.x, this.y + vector.y);
		} else {
			throw new Error('Передаваемый в функцию обьект не является вектором.');
		}
	}

	/*
	Метод `times`
		Принимает один аргумент — множитель, _число_.
	  	Создает и возвращает новый _объект_ типа `Vector`, координаты которого будут равны соответствующим координатам исходного вектора, 
	  	умноженным на множитель.
	*/

	times(multiplier) {
		return new Vector(this.x * multiplier, this.y * multiplier);
	}
}

/*
Необходимо реализовать класс `Actor`, который позволит контролировать все движущиеся объекты на игровом поле
и контролировать их пересечение.
*/

class Actor {
	/*
	Конструктор:
		Принимает три аргумента: расположение, _объект_ типа `Vector`, размер, тоже _объект_ типа `Vector` и скорость, тоже _объект_ типа `Vector`. 
		Все аргументы необязательные. По умолчанию создается объект с координатами 0:0, размером 1x1 и скоростью 0:0.
		Если в качестве первого, второго или третьего аргумента передать не объект типа `Vector`, то конструктор должен бросить исключение.
	Свойства:
		Должно быть определено свойство `pos`, в котором размещен `Vector`.
		Должно быть определено свойство `size`, в котором размещен `Vector`.
		Должно быть определено свойство `speed`, в котором размещен `Vector`.
		Должен быть определен метод `act`, который ничего не делает.
		Должны быть определены свойства только для чтения `left`, `top`, `right`, `bottom`, в которых установлены границы объекта по осям X и Y с 
		учетом его расположения и размера.
		Должен иметь свойство `type` — строку со значением `actor`, только для чтения.
	*/
	
	constructor(vectorPos = new Vector(0, 0), vectorSize = new Vector(1, 1), vectorSpeed = new Vector(0, 0)) {
		if (!(vectorPos instanceof Vector && vectorSize instanceof Vector && vectorSpeed instanceof Vector)) {
			throw new Error('Передаваемый в функцию обьект не является вектором.');
		}

		this.pos = vectorPos;
		this.size = vectorSize;
		this.speed = vectorSpeed;
	}

	act() { }
	get type() { return 'actor'; }
	get left() { return this.pos.x; }
	get top() { return this.pos.y; }
	get right() { return this.pos.x + this.size.x; }
	get bottom() { return this.pos.y + this.size.y; }

	/*
	Метод `isIntersect`:
		Метод проверяет, пересекается ли текущий объект с переданным объектом, и если да, возвращает `true`, иначе – `false`.
		Принимает один аргумент — движущийся объект типа `Actor`. Если передать аргумент другого типа или вызвать без аргументов, то метод бросает исключение.
		Если передать в качестве аргумента этот же объект, то всегда возвращает `false`. Объект не пересекается сам с собой.
		Объекты, имеющие смежные границы, не пересекаются.
	*/

	isIntersect(actor) {
		if (!(actor instanceof Actor)) {
			throw new Error('Неверный аргумент функции.'); 
		} else if (actor === this) {
			return false;
		}
		
		return !(this.left >= actor.right || this.top >= actor.bottom || this.right <= actor.left || this.bottom <= actor.top);
	}
}

/*
Объекты класса `Level` реализуют схему игрового поля конкретного уровня, контролируют все движущиеся объекты на нём и реализуют логику игры.
Уровень представляет собой координатное поле, имеющее фиксированную ширину и высоту.
Сетка уровня представляет собой координатное двумерное поле, представленное двумерным массивом. Первый массив — строки игрового поля; индекс
этого массива соответствует координате Y на игровом поле. Элемент с индексом `5` соответствует строке с координатой Y, равной `5`. Вложенные
массивы, расположенные в элементах массива строк, представляют ячейки поля. Индекс этих массивов соответствует координате X. Например, элемент с
индексом `10`, соответствует ячейке с координатой X, равной `10`.
Так как `grid` — это двумерный массив, представляющий сетку игрового поля, то, чтобы узнать, что находится в ячейке с координатами X=10 и Y=5 (10:5),
необходимо получить значение `grid[5][10]`. Если значение этого элемента равно `undefined`, то эта ячейка пуста. Иначе там будет строка, описывающая
препятствие. Например, `wall` — для стены и `lava` — для лавы. Отсюда вытекает следующий факт: все препятствия имеют целочисленные размеры и координаты.
*/

class Level {

	/*
	Конструктор:
		Принимает два аргумента: сетку игрового поля с препятствиями, _массив массивов строк_, и список движущихся объектов, _массив объектов_ `Actor`. 
		Оба аргумента необязательные.
	Свойства:
		Имеет свойство `grid` — сетку игрового поля. Двумерный массив строк.
		Имеет свойство `actors` — список движущихся объектов игрового поля, массив объектов `Actor`.
		Имеет свойство `player` — движущийся объект, тип которого — свойство `type` — равно `player`. Игорок передаётся с остальными движущимися объектами.
		Имеет свойство `height` — высоту игрового поля, равное числу строк в сетке из первого аргумента.
		Имеет свойство `width` — ширину игрового поля, равное числу ячеек в строке сетки из первого аргумента. При этом, если в разных строках разное число ячеек, 
		то `width` будет равно максимальному количеству ячеек в строке.
		Имеет свойство `status` — состояние прохождения уровня, равное `null` после создания.
		Имеет свойство `finishDelay` — таймаут после окончания игры, равен `1` после создания. Необходим, чтобы после выигрыша или проигрыша игра не 
		завершалась мгновенно.
	*/

	constructor(grid, actors) {
		this.grid = grid || [];
		this.actors = actors;
		this.status = null;
		this.finishDelay = 1;
	}

	get height() {
		return this.grid.length;
	}

	get width() {
		let width = 0;
		this.grid.forEach(string => {
			if (string.length > width) {
				width = string.length;
			}
		});

		return width;
	}

	get player() {
		return this.actors.find(act => {
			if (act.type === 'player') {
				return act;
			}
		});
	}

	/*
	Метод `isFinished`:
		Определяет, завершен ли уровень. Не принимает аргументов.
		Возвращает `true`, если свойство `status` не равно `null` и `finishDelay` меньше нуля.
	*/

	isFinished() {
		return this.status !== null && this.finishDelay < 0;
	}

	/*
	Метод `actorAt`:
		Определяет, расположен ли какой-то другой движущийся объект в переданной позиции, и если да, вернёт этот объект.
		Принимает один аргумент — движущийся объект, `Actor`. Если не передать аргумент или передать не объект `Actor`, метод должен бросить исключение.
		Возвращает `undefined`, если переданный движущийся объект не пересекается ни с одним объектом на игровом поле.
		Возвращает объект `Actor`, если переданный объект пересекается с ним на игровом поле. Если пересекается с несколькими объектами, вернет первый.
	*/

	actorAt(actor) {
		if (!(actor instanceof Actor)) {
			throw new Error('Передан неверный аргумент, либо аргумент отсутствует.');
		} else if(this.actors) {
			for (let item of this.actors) {
				if (actor.isIntersect(item)) {
					return item;
				}
			}
		}
	}

	/*
	Метод `obstacleAt`:
		Аналогично методу `actorAt` определяет, нет ли препятствия в указанном месте. Также этот метод контролирует выход объекта за границы игрового поля.
		Так как движущиеся объекты не могут двигаться сквозь стены, то метод принимает два аргумента: положение, куда собираемся передвинуть 
		объект, _вектор_ `Vector`, и размер этого объекта, тоже _вектор_ `Vector`. Если первым и вторым аргументом передать не `Vector`, то метод бросает исключение.
		Вернет строку, соответствующую препятствию из сетки игрового поля, пересекающему область, описанную двумя переданными векторами, либо `undefined`, 
		если в этой области препятствий нет.
		Если описанная двумя векторами область выходит за пределы игрового поля, то метод вернет строку `lava`, если область выступает снизу. И вернет `wall` 
		в остальных случаях. Будем считать, что игровое поле слева, сверху и справа огорожено стеной и снизу у него смертельная лава.
	*/

	obstacleAt(nextPos, vecSize) {
		if (!(nextPos instanceof Vector) && !(vecSize instanceof Vector)) {
			throw new Error('Передан неверный аргумент.');
		}
		
		if ((nextPos.y + vecSize.y) > this.height) {
			return 'lava';
		} else if ((nextPos.y < 0) || (nextPos.x < 0) || ((nextPos.x + vecSize.x) > this.width)) {
			return 'wall';
		} else {
			let startX = Math.floor(nextPos.x);
			let endX = Math.ceil(nextPos.x + vecSize.x);
			let startY = Math.floor(nextPos.y);
			let endY = Math.ceil(nextPos.y + vecSize.y);

			for (let i = startY; i < endY; i++) {
				for (let j = startX; j < endX; j++) {
					if (this.grid[i][j]) {
						return this.grid[i][j];
					}
				}
			}
		}
	}

	/*
	Метод `removeActor`:
		Метод удаляет переданный объект с игрового поля. Если такого объекта на игровом поле нет, не делает ничего.
		Принимает один аргумент, объект `Actor`. Находит и удаляет его.
	*/

	removeActor(actor) {
		let index = this.actors.indexOf(actor);
		if (index !== -1) {
			this.actors.splice(index, 1);
		}
	}

	/*
	Метод `noMoreActors`:
		Определяет, остались ли еще объекты переданного типа на игровом поле.
		Принимает один аргумент — тип движущегося объекта, _строка_.
		Возвращает `true`, если на игровом поле нет объектов этого типа (свойство `type`). Иначе возвращает `false`.
	*/

	noMoreActors(actorType) {
		let result = true;

		if (this.actors) {
			this.actors.forEach(item => {
				if (item.type === actorType) {
					result = false;
				}
			});
		}

		return result;
	}

	/*
	Метод `playerTouched`:
		Один из ключевых методов, определяющий логику игры. Меняет состояние игрового поля при касании игроком каких-либо объектов или препятствий.
		Если состояние игры уже отлично от `null`, то не делаем ничего, игра уже и так завершилась.
		Принимает два аргумента. Тип препятствия или объекта, _строка_. Движущийся объект, которого коснулся игрок, — объект типа `Actor`, 
		необязательный аргумент.
		Если первым аргументом передать строку `lava` или `fireball`, то меняем статус игры на `lost` (свойство `status`). Игрок проигрывает при 
		касании лавы или шаровой молнии.
		Если первым аргументом передать строку `coin`, а вторым — объект монеты, то необходимо удалить эту монету с игрового поля. Если при этом 
		на игровом поле не осталось больше монет, то меняем статус игры на `won`. Игрок побеждает, когда собирает все монеты на уровне. Отсюда 
		вытекает факт, что уровень без монет пройти невозможно.
	*/

	playerTouched(barrier, actor) {
		if (this.status === null) {
			if (barrier === 'lava' || barrier === 'fireball') {
				this.status = 'lost';
			} else if (barrier === 'coin' && actor.type === 'coin') {
				this.removeActor(actor);

				const find = this.actors.some(item => {
					return item.type === 'coin';
				});

				if (find === false) {
					this.status = 'won';
				}
			}
		}
	}
}

/*
Объект класса `LevelParser` позволяет создать игровое поле `Level` из массива строк по следующему принципу:
	Каждый элемент массива соответствует строке в сетке уровня.
	Каждый символ строки соответствует ячейке в сетке уровня.
	Символ определяет тип объекта или препятствия.
	Индекс строки и индекс символа определяют исходные координаты объекта или координаты препятствия.

Символы и соответствующие им препятствия и объекты игрового поля:
	**x** — стена, препятствие
	**!** — лава, препятствие
	**@** — игрок, объект
	**o** — монетка, объект
	**=** — движущаяся горизонтально шаровая молния, объект
	**|** — движущаяся вертикально шаровая молния, объект
	**v** — огненный дождь, объ
*/

class LevelParser {

	/*
	Конструктор:
		Принимает один аргумент — словарь движущихся объектов игрового поля, _объект_, ключами которого являются символы из текстового 
		представления уровня, а значениями — конструкторы, с помощью которых можно создать новый объект.
	*/

	constructor(mapActors) {
		this.mapActors = mapActors;
	}

	/*
	Метод `actorFromSymbol`:
		Принимает символ, _строка_. Возвращает конструктор объекта по его символу, используя словарь. Если в словаре не нашлось ключа 
		с таким символом, вернет `undefined`.
	*/

	actorFromSymbol(symbol) {
		if (symbol === undefined) {
			return undefined;
		} else if (symbol in this.mapActors) {
			return this.mapActors[symbol];
		}
	}

	/*
	Метод `obstacleFromSymbol`:
		Аналогично принимает символ, _строка_. Возвращает строку, соответствующую символу препятствия. Если символу нет соответствующего препятствия, 
		то вернет `undefined`.
		Вернет `wall`, если передать `x`.
		Вернет `lava`, если передать `!`.
		Вернет `undefined`, если передать любой другой символ.
	*/

	obstacleFromSymbol(symbol) {
		if (symbol === 'x') {
			return 'wall';
		}
		else if (symbol === '!') {
			return 'lava';
		}
	}

	/*
	Метод `createGrid`:
		Принимает массив строк и преобразует его в массив массивов, в ячейках которого хранится либо строка, соответствующая препятствию, либо `undefined`.
		Движущиеся объекты не должны присутствовать на сетке.
	*/

	createGrid(plan) {
		if (plan.length === 0) {
			return [];
		} else {
			let newPlan = [];

			plan.forEach(planString => {
				let row = [];
				
				for (let i = 0; i < planString.length; i++) {
					row.push(this.obstacleFromSymbol(planString[i]));
				}
				
				newPlan.push(row);
			});

			return newPlan;
		}
	}

	/*
	Метод `createActors`:
		Принимает массив строк и преобразует его в массив движущихся объектов, используя для их создания классы из словаря.
		Количество движущихся объектов в результирующем массиве должно быть равно количеству символов объектов в массиве строк.
		Каждый объект должен быть создан с использованием вектора, определяющего его положение с учетом координат, полученных на основе индекса 
		строки в массиве (Y) и индекса символа в строке (X).
		Для создания объекта должен быть использован класс из словаря, соответствующий символу. При этом, если этот класс не является наследником `Actor`, 
		то такой символ игнорируется, и объект не создается.
	*/

	createActors(plan) {
		if (plan.length === 0) {
			return [];
		} else {
			let actors = [];

			for (let y = 0; y < plan.length; y++) {
				for (let x = 0; x < plan[y].length; x++) {
					let s = plan[y][x];

					if (this.mapActors) {
						let objConstructor = this.actorFromSymbol(s);
						if (typeof objConstructor === 'function') {
							let obj = new objConstructor(new Vector(x,y));
							
							if (obj instanceof Actor) {
								actors.push(obj);
							}
						}
					}
				}
			}

			return actors;
		}
	}

	/*
	Метод `parse`:
		Принимает массив строк, создает и возвращает игровое поле, заполненное препятствиями и движущимися объектами, полученными на основе символов и словаря.
	*/

	parse(plan) {
		return new Level(this.createGrid(plan), this.createActors(plan));
	}
}

/*
Класс `Fireball` станет прототипом для движущихся опасностей на игровом поле.
Он должен наследовать весь функционал движущегося объекта `Actor`.
*/

class Fireball extends Actor {
	
	/*
	Конструктор:
		Принимает два аргумента: координаты, _объект_ `Vector` и скорость, тоже _объект_ `Vector`. Оба аргумента необязательные. 
		По умолчанию создается объект с координатами `0:0` и скоростью `0:0`.
	Свойства:
		Созданный объект должен иметь свойство `type` со значением `fireball`. Это свойство только для чтения.
		Также должен иметь размер `1:1` в свойстве `size`, _объект_ `Vector`.
	*/

	constructor(pos = new Vector(0, 0), speed = new Vector(0, 0)) {
		super(pos, new Vector(1, 1), speed);
	}

	get type() {
		return 'fireball';
	}

	/*
	Метод `getNextPosition`:
		Создает и возвращает вектор `Vector` следующей позиции шаровой молнии. Это функция времени. И как в школьной задаче, новая позиция — 
		это текущая позиция плюс скорость, умноженная на время. И так по каждой из осей.
		Принимает один аргумент, время, _число_. Аргумент необязательный, по умолчанию равен `1`.
	*/

	getNextPosition(time = 1) {
		return new Vector(this.pos.x + this.speed.x * time, this.pos.y + this.speed.y * time);
	}

	/*
	Метод `handleObstacle`:
		Обрабатывает столкновение молнии с препятствием. Не принимает аргументов. Ничего не возвращает.
		Меняет вектор скорости на противоположный. Если он был `5:5`, то после должен стать `-5:-5`.
	*/

	handleObstacle() {
		this.speed = new Vector(Number(-1 * this.speed.x), Number(-1 * this.speed.y));
	}

	/*
	Метод `act`:
		Обновляет состояние движущегося объекта.
		Принимает два аргумента. Первый — время, _число_, второй — игровое поле, _объект_ `Level`.
		Метод ничего не возвращает. Но должен выполнить следующие действия:
		1. Получить следующую позицию, используя время.
		2. Выяснить, не пересечется ли в следующей позиции объект с каким-либо препятствием. Пересечения с другими движущимися объектами учитывать не нужно.
		3. Если нет, обновить текущую позицию объекта.
		4. Если объект пересекается с препятствием, то необходимо обработать это событие. При этом текущее положение остается прежним.
	*/

	act(time, grid) {
		let nextPosition = this.getNextPosition(time);
		
		grid.obstacleAt(nextPosition, this.size) ? this.handleObstacle() : this.pos = nextPosition;
	}
}

/*
Вам необходимо самостоятельно реализовать класс `HorizontalFireball`. Он будет представлять собой объект, который движется по горизонтали со
скоростью `2` и при столкновении с препятствием движется в обратную сторону.
*/

class HorizontalFireball extends Fireball {
	/*
	Конструктор должен принимать один аргумент — координаты текущего положения, _объект_ `Vector`. И создавать объект размером `1:1` и скоростью, 
	равной `2` по оси X.
	*/

	constructor(pos) {
		super(pos, new Vector(2, 0));
	}
}

/*
Вам необходимо самостоятельно реализовать класс `VerticalFireball`. Он будет представлять собой объект, который движется по вертикали
со скоростью `2` и при столкновении с препятствием движется в обратную сторону.
*/

class VerticalFireball extends Fireball {
	/*
	Конструктор должен принимать один аргумент: координаты текущего положения, _объект_ `Vector`. И создавать объект размером `1:1` и скоростью, 
	равной `2` по оси Y.
	*/

	constructor(pos) {
		super(pos, new Vector(0, 2));
	}
}

/*
Вам необходимо самостоятельно реализовать класс `FireRain`. Он будет представлять собой объект, который движется по вертикали со скоростью `3`
и при столкновении с препятствием начинает движение в том же направлении из исходного положения, которое задано при создании.
*/

class FireRain extends Fireball {
	/*
	Конструктор должен принимать один аргумент — координаты текущего положения, _объект_ `Vector`. И создавать объект размером `1:1` и скоростью, 
	равной `3` по оси Y.
	*/

	constructor(pos) {
		super(pos, new Vector(0,3));
		this.startPosition = pos;
	}

	handleObstacle() {
		this.pos = this.startPosition;
	}
}

/*
Класс `Coin` реализует поведение монетки на игровом поле. Чтобы привлекать к себе внимание, монетки должны постоянно подпрыгивать в рамках
своей ячейки. Класс должен наследовать весь функционал движущегося объекта `Actor`.
*/

class Coin extends Actor {
	/*
	Конструктор:
		Принимает один аргумент — координаты положения на игровом поле, _объект_ `Vector`.
		Созданный объект должен иметь размер `0,6:0,6`. А его реальные координаты должны отличаться от тех, что переданы в конструктор, на вектор `0,2:0,1`.
	Свойства:
		Свойство `type` созданного объекта должно иметь значение `coin`.
		Также объект должен иметь следующие свойства:
		* Скорость подпрыгивания, `springSpeed`, равная `8`;
		* Радиус подпрыгивания, `springDist`, равен `0.07`;
		* Фаза подпрыгивания, `spring`, случайное число от `0` до `2π`.
	*/

	constructor(pos) {
		super(pos, new Vector(0.6, 0.6));
		this.spring = Math.random() * Math.PI * 2;
		this.springSpeed = 8;
		this.springDist = 0.07;
		this.pos = this.pos.plus(new Vector(0.2, 0.1));
		this.basicPos = this.pos;
	}

	get type() {
		return 'coin';
	}

	/*
	Метод `updateSpring`:
		Обновляет фазу подпрыгивания. Это функция времени.
		Принимает один аргумент — время, _число_, по умолчанию `1`.
		Ничего не возвращает. Обновляет текущую фазу `spring`, увеличив её на скорость `springSpeed`, умноженную на время.
	*/

	updateSpring(time = 1) {
		this.spring = this.spring + this.springSpeed * time;
	}

	/*
	Метод `getSpringVector`:
		Создает и возвращает вектор подпрыгивания. Не принимает аргументов.
		Так как подпрыгивание происходит только по оси Y, то координата X вектора всегда равна нулю.
		Координата Y вектора равна синусу текущей фазы, умноженному на радиус.
	*/

	getSpringVector() {
		return new Vector(0, Math.sin(this.spring) * this.springDist);
	}

	/*
	Метод `getNextPosition`:
		Обновляет текущую фазу, создает и возвращает вектор новой позиции монетки.
		Принимает один аргумент — время, _число_, по умолчанию `1`.
		Новый вектор равен базовому вектору положения, увеличенному на вектор подпрыгивания. Увеличивать нужно именно базовый вектор 
		положения, который получен в конструкторе, а не текущий.
	*/

	getNextPosition(time = 1) {
		this.updateSpring(time);
		return this.basicPos.plus(this.getSpringVector());
	}

	/*
	Метод `act`:
		Принимает один аргумент — время. Получает новую позицию объекта и задает её как текущую. Ничего не возвращает.
	*/

	act(time) {
		this.pos = this.getNextPosition(time);
	}
}

/*
Класс `Player` содержит базовый функционал движущегося объекта, который представляет игрока на игровом поле.
Должен наследовать возможности `Actor`.
*/

class Player extends Actor {
	
	/*
	Конструктор:
		Принимает один аргумент — координаты положения на игровом поле, _объект_ `Vector`.
		Созданный объект, реальное положение которого отличается от того, что передано в конструктор, на вектор `0:-0,5`. Имеет размер `0,8:1,5`. И скорость `0:0`.
	Свойства:
		Имеет свойство `type`, равное `player`.
	*/

	constructor(pos) {
		super(pos, new Vector(0.8, 1.5));
		this.pos = this.pos.plus(new Vector(0, -0.5));
	}

	get type() {
		return 'player';
	}
}

const schemas = [
  [
  	'           v              ',
    '                          ',
    '              o           ',
    '          x  xxx          ',
    '    =     x               ',
    '       o  x              o',
    '     !xxxxx           xxxx',
    ' @                        ',
    'xxx!     o       xxxx     ',
    '         xxxxx            ',
    '!!!!!!!!!!!!!!!!!!!!!!!!!!'
  ],
  [
  	'           v              v                   v           ',
    '                                                          ',
    '              o                                           ',
    '          x  xxx            =                           o ',
    '    =     x                 x          =          xxxxxx  ',
    '       o  x                 x       xxxxxx        x       ',
    '     !xxxxx           xxxx  x o                   x       ',
    ' @                          xxxxx              xxxx       ',
    'xxx!     o       xxxx             =    o                  ',
    '         xxxxx                        xxxx                ',
    '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'
  ],
  [
  	'           v              v                   v           ',
    '                                                          ',
    '              o             =                             ',
    '          x                 x          x                  ',
    '    =     x                 x          xo         xxxxx   ',
    '       o  x  xxx       xxx  x        xxxxx        x  =    ',
    '     !xxxxx                 x o                   x       ',
    ' @                  =       xxxxx              xxxx       ',
    'xxx!  o           xxx             =    o            o     ',
    '     xxxxxxxxx                        xxxx          xxxxxx',
    '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'
  ]
];


const actorDict = {
  '@': Player,
  'v': FireRain,
  '=': HorizontalFireball,
  '|': VerticalFireball,
  'o': Coin
}

const parser = new LevelParser(actorDict);

runGame(schemas, parser, DOMDisplay)
	.then(() => alert('Вы выиграли!'));