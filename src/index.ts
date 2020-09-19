import 'babel-polyfill'
import { addJoystickCLickListener, useButtonForAction } from './helpers'
import { IScreen } from './IScreen'
import { WelcomeScreen } from './screens/WelcomeScreen'

console.info('Blocks game by Ugnius Kavaliauskas 2020 https://github.com/ugnius/blocks-game')
let canvas: HTMLCanvasElement
let context: CanvasRenderingContext2D

let screens: IScreen[] = []

init()

function init() {
	const _canvas = document.getElementById('main-canvas') as HTMLCanvasElement | null
	if (!_canvas) { throw new Error('Can not get canvas element') }
	canvas = _canvas
	const _context = canvas.getContext('2d')
	if (!_context) { throw new Error('Can not get canvas context') }
	context = _context

	canvas.width = 360
	canvas.height = 440
	canvas.style.height = `100vh`
	canvas.style.width = `calc(100vh / ${canvas.height} * ${canvas.width})`
	canvas.style.maxWidth = `100vw`
	canvas.style.maxHeight = `calc(100vw * ${canvas.height} / ${canvas.width})`

	screens.push(new WelcomeScreen(screens))

	const topScreen = () => screens[screens.length - 1]

	window.addEventListener('keydown', (event: KeyboardEvent) => topScreen().handleKeyDown(event))
	canvas.addEventListener('click', (event: MouseEvent) => topScreen().handleClick(event))
	
	useButtonForAction('button-move-left', () => topScreen().handleAction('left'))
	useButtonForAction('button-move-right', () => topScreen().handleAction('right'))
	useButtonForAction('button-move-down', () => topScreen().handleAction('down'))
	useButtonForAction('button-rotate-right', () => topScreen().handleAction('rotate'))
	useButtonForAction('button-rotate-left', () => topScreen().handleAction('rotateBack'))
	addJoystickCLickListener((code: string) => topScreen().handleGamepadClick(code))
	
	window.requestAnimationFrame(tick)
}



let lastUpdate = Date.now()

function tick() {

	const now = Date.now()
	const dt = Math.min(now - lastUpdate, 1000)
	lastUpdate = now

	for (const screen of screens) {
		screen.update(dt, screen === screens[screens.length - 1])
	}

	let lastNonTransparentScreenIndex = 0
	for (let i = screens.length - 1; i >= 0; i--) {
		lastNonTransparentScreenIndex = i
		if (!screens[i].transparent) {
			break;
		}
	}
	for (let i = lastNonTransparentScreenIndex; i < screens.length; i++) {
		screens[i].render(canvas, context)
	}

	window.requestAnimationFrame(tick)
}
