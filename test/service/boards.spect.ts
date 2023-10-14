import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { BoardsService } from "../../src/service/boards.service";
import { BoardsRepository } from "../../src/database/repository/BoardRepository/boards.repository";
import { HashtagRepository } from "../../src/database/repository/hashtag.repository";
import { CreateBoardDto } from "../../src/controller/board/board.controller.dto/create-board.dto";

describe('BoardsService', () => {
  let service: BoardsService;
  let boardsRepository: BoardsRepository;
  let hashtagRepository: HashtagRepository;
  let mockDataSource: any;

  beforeEach(async () => {
    mockDataSource = {
      createQueryRunner: jest.fn()
    }

    mockHashtagRepository = {
      findHashTagList: jest.fn().mockResolvedValue([]),
      // Add other mock implementations if needed
    };

    mockDataSource = {
      // Add mock implementations for dataSource if needed
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardsService,
        { provide: BoardsRepository, useValue: mockBoardsRepository },
        { provide: HashtagRepository, useValue: mockHashtagRepository },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<BoardsService>(BoardsService);
  });

  describe('createBoard', () => {
    it('should successfully create a board', async () => {
      const createBoardDto: CreateBoardDto = {
        title: 'Test Title',
        content: 'Test Content',
        boardHashTag: ['test1', 'test2'],
        boardImages: ['image1.jpg', 'image2.jpg'],
        // ... other fields
      };

      const result = await service.createBoard(createBoardDto, 1);

      expect(result).toBeDefined();
      expect(result.statusCode).toBe(201); // Assuming 201 is the status code for "CREATED"
      // Add more assertions as necessary
    });

    // Additional tests for other methods can be added similarly...
  });
});

