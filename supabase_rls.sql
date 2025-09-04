-- Policies for projects table
CREATE POLICY "Allow all on projects for authenticated users" ON projects FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policies for users table
CREATE POLICY "Allow all on users for authenticated users" ON users FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policies for clients table
CREATE POLICY "Allow all on clients for authenticated users" ON clients FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policies for employees table
CREATE POLICY "Allow all on employees for authenticated users" ON employees FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policies for invoices table
CREATE POLICY "Allow all on invoices for authenticated users" ON invoices FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policies for tasks table
CREATE POLICY "Allow all on tasks for authenticated users" ON tasks FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policies for documents table
CREATE POLICY "Allow all on documents for authenticated users" ON documents FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policies for communications table
CREATE POLICY "Allow all on communications for authenticated users" ON communications FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policies for materials table
CREATE POLICY "Allow all on materials for authenticated users" ON materials FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policies for suppliers table
CREATE POLICY "Allow all on suppliers for authenticated users" ON suppliers FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policies for client_contacts table
CREATE POLICY "Allow all on client_contacts for authenticated users" ON client_contacts FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policies for timesheets table
CREATE POLICY "Allow all on timesheets for authenticated users" ON timesheets FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policies for expenses table
CREATE POLICY "Allow all on expenses for authenticated users" ON expenses FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
