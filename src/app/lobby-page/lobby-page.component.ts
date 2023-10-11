import { Component, OnInit } from '@angular/core';
import { CodeBlockService } from '../code-block.service';

@Component({
  selector: 'app-lobby-page',
  templateUrl: './lobby-page.component.html',
  styleUrls: ['./lobby-page.component.css']
})
export class LobbyPageComponent implements OnInit {
  codeBlocks: any[] = [];

  constructor(private codeBlockService: CodeBlockService) { }

  ngOnInit(): void {
    // Fetch the list of code blocks from the CodeBlockService
    this.codeBlockService.getCodeBlocks().subscribe((codeBlocks) => {
      this.codeBlocks = codeBlocks;
    });
  }
}
