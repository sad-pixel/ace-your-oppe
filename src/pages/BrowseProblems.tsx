import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  DatabaseIcon,
  CodeIcon,
  BookOpen,
  GraduationCap,
  ShoppingCart,
  Trophy,
  EyeIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { useDebounce } from "@uidotdev/usehooks";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

type Database = {
  id: number;
  name: string;
};

type Problem = {
  id: number;
  setId: number;
  questionNo: number;
  question: string;
  database: number;
  type: string;
  databaseName: string;
  setName: string;
};

type PaginationData = {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

const BrowseProblems = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [selectedType, setSelectedType] = useState<string | null>(
    searchParams.get("type") || null,
  );
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>(
    searchParams.get("database") || null,
  );
  const [page, setPage] = useState(
    parseInt(searchParams.get("page") || "1", 10),
  );
  const limit = 10; // Number of items per page

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Update URL params when filters change
  useEffect(() => {
    const params: Record<string, string> = {};

    if (debouncedSearchQuery) {
      params.search = debouncedSearchQuery;
    }

    if (selectedType && selectedType !== "all") {
      params.type = selectedType;
    }

    if (selectedDatabase && selectedDatabase !== "all") {
      params.database = selectedDatabase;
    }

    if (page > 1) {
      params.page = page.toString();
    }

    setSearchParams(params, { replace: true });
  }, [
    debouncedSearchQuery,
    selectedType,
    selectedDatabase,
    page,
    setSearchParams,
  ]);

  const { data, isLoading } = useQuery(
    trpc.browseProblems.queryOptions({
      search: debouncedSearchQuery,
      type:
        selectedType === null || selectedType === "all"
          ? null
          : (selectedType as "sql" | "python"),
      database:
        selectedDatabase === null || selectedDatabase === "all"
          ? null
          : (selectedDatabase as "lis" | "flis" | "university" | "eshop"),
      page,
      limit,
    }),
  );

  const problems = data?.data || [];
  const pagination: PaginationData | undefined = data?.pagination;

  const { data: databases } = useQuery(trpc.getAllDatabases.queryOptions());

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setPage(1); // Reset to first page on filter change
  };

  const handleDatabaseChange = (value: string) => {
    setSelectedDatabase(value);
    setPage(1); // Reset to first page on filter change
  };

  const handlePreviousPage = () => {
    if (pagination?.hasPrevPage) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination?.hasNextPage) {
      setPage(page + 1);
    }
  };

  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Browse Problems
            </h1>
            <p className="text-muted-foreground">
              Search and filter through available OPPE practice problems
            </p>
          </div>

          <Card className="border shadow-sm">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <Input
                    placeholder="Search problems"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full"
                  />
                </div>
                <div>
                  <Select
                    value={selectedType || undefined}
                    onValueChange={handleTypeChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Problem Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="sql">SQL</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select
                    value={selectedDatabase || undefined}
                    onValueChange={handleDatabaseChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Database" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">All Databases</SelectItem>
                        {databases?.map((db: Database) => (
                          <SelectItem key={db.id} value={db.name}>
                            {db.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center my-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <>
                  {problems.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Problem</TableHead>
                          <TableHead>Set</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Database</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {problems.map((problem: Problem) => (
                          <TableRow
                            key={problem.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => navigate(`/problems/${problem.id}`)}
                          >
                            <TableCell>
                              <div>
                                <span className="text-sm text-muted-foreground">
                                  Question #{problem.questionNo}
                                </span>
                                <p className="font-medium">
                                  {problem.question.length > 50
                                    ? `${problem.question.substring(0, 50)}...`
                                    : problem.question}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>{problem.setName}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`${
                                  problem.type === "sql"
                                    ? "bg-blue-100 text-blue-800 border-blue-200"
                                    : "bg-green-100 text-green-800 border-green-200"
                                }`}
                              >
                                {problem.type === "sql" ? (
                                  <DatabaseIcon className="w-3 h-3 mr-1" />
                                ) : (
                                  <CodeIcon className="w-3 h-3 mr-1" />
                                )}
                                {problem.type.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {problem.databaseName === "lis" && (
                                  <BookOpen className="w-3 h-3 mr-1 text-muted-foreground" />
                                )}
                                {problem.databaseName === "flis" && (
                                  <Trophy className="w-3 h-3 mr-1 text-muted-foreground" />
                                )}
                                {problem.databaseName === "university" && (
                                  <GraduationCap className="w-3 h-3 mr-1 text-muted-foreground" />
                                )}
                                {problem.databaseName === "eshop" && (
                                  <ShoppingCart className="w-3 h-3 mr-1 text-muted-foreground" />
                                )}
                                {![
                                  "lis",
                                  "flis",
                                  "university",
                                  "eshop",
                                ].includes(problem.databaseName) && (
                                  <DatabaseIcon className="w-3 h-3 mr-1 text-muted-foreground" />
                                )}
                                {problem.databaseName === "lis"
                                  ? "LIS"
                                  : problem.databaseName === "flis"
                                    ? "FLIS"
                                    : problem.databaseName === "university"
                                      ? "University"
                                      : problem.databaseName === "eshop"
                                        ? "EShop"
                                        : problem.databaseName}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/problems/${problem.id}`}>
                                  <EyeIcon className="w-3 h-3 mr-1 text-muted-foreground" />
                                  View
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center my-8">
                      <h4 className="text-xl font-semibold">
                        No problems found matching your criteria.
                      </h4>
                    </div>
                  )}

                  {pagination && pagination.totalPages > 0 && (
                    <div className="flex items-center justify-center space-x-4 mt-8">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={!pagination.hasPrevPage}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>

                      <div className="text-sm text-muted-foreground">
                        Page {pagination.currentPage} of {pagination.totalPages}
                        {pagination.total > 0 &&
                          ` (${pagination.total} total results)`}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={!pagination.hasNextPage}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default BrowseProblems;
