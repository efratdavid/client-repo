import { Component, OnInit, ViewChild, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CodeBlockService } from '../code-block.service';
import { SocketService } from '../socket.service';
import * as CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';


@Component({
  selector: 'app-code-block-page',
  templateUrl: './code-block-page.component.html',
  styleUrls: ['./code-block-page.component.css']
})
export class CodeBlockPageComponent implements OnInit, AfterViewInit {
  codeBlockId!: string | null;
  code!: string;
  title!: string;
  isMentor: boolean = false;
  isCorrect: boolean = false;

  private cm!: CodeMirror.Editor;

  @ViewChild('codeEditor')
  codeEditor!: ElementRef;
  
  constructor(
    private route: ActivatedRoute,
    private codeBlockService: CodeBlockService,
    private socketService: SocketService
  ) {
    // Check if the role is already stored in sessionStorage
    const storedRole = sessionStorage.getItem('role');

    if (storedRole === 'mentor' || storedRole === 'student') {
      this.isMentor = storedRole === 'mentor';
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.codeBlockId = params.get('id');

      // Fetch the code block by ID using HTTP
      if (this.codeBlockId !== null) {
        this.codeBlockService.getCodeBlockById(this.codeBlockId).subscribe(data => {
          this.code = data.code;
          this.title = data.title;
          
          this.cm.setValue(this.code);
          this.cm.setOption('readOnly', this.isMentor);

          // Check if the correct solution matches the code in the editor (this.code)
          this.isCorrect = data.solution.trim() === this.code.trim();
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.cm = CodeMirror.fromTextArea(this.codeEditor.nativeElement, {
      mode: 'javascript', // Set the language mode
      lineNumbers: true, // Display line numbers
      theme: 'default', // Set the CodeMirror theme
      readOnly: true // Initially set as read-only, will be updated based on role
    });

    // Listen for the mentor flag received from the server
    this.socketService.on('mentor', (isMentor: boolean) => {
        console.log('isMentor: ', isMentor);
        this.isMentor = isMentor;

        // Set the CodeMirror editor's read-only property based on the role
        this.cm.setOption('readOnly', this.isMentor);

        // Store the role in sessionStorage
        sessionStorage.setItem('role', this.isMentor ? 'mentor' : 'student');
    });

    // Add a change event listener
    this.cm.on('change', (cm: CodeMirror.Editor) => {
      // Get the updated code whenever the content of the CodeMirror editor changes
      const updatedCode = cm.getValue();
      // Automatically send code updates to the server via Socket.io
      this.socketService.emit('code-update', { _id: this.codeBlockId, code: updatedCode });
    });

    // Listen for code updates from Socket.io server
    this.socketService.on('code-updated', (data: any) => {
      if (data._id === this.codeBlockId) {
        this.code = data.code;
        const currentCode = this.cm.getValue();
        const updatedCode = data.code;
    
        if (currentCode !== updatedCode) {
          const cursor = this.cm.getCursor();
    
          // Update the editor's content only if it's different from the received data
          this.cm.setValue(updatedCode);
    
          // Restore the cursor position
          this.cm.setCursor(cursor);
        }

        // Check if the correct solution matches the code in the editor (this.code)
        this.isCorrect = data.solution.trim() === this.code.trim();
      }
    });
  }
}


