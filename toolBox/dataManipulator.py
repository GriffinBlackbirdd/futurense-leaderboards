import pandas as pd

def excel_to_ranks(excel_path, output_csv_path=None):
    if output_csv_path is None:
        output_csv_path = excel_path.rsplit('.', 1)[0] + '.csv'

    df = pd.read_excel(excel_path)

    point_columns = [
        'resume_points',
        'aptitude_points',
        'mock_points',
        'dpai900_points',
        'dp203etc_points',
        'ai_cert_points',
        'problem_solving_points',
        'final_project'
    ]

    df['points'] = df[point_columns].sum(axis=1)
    df['rank'] = df['points'].rank(method='dense', ascending=False).astype(int)
    df = df.sort_values('points', ascending=False)
    df.to_csv(output_csv_path, index=False)

    return df
if __name__ == "__main__":
    excelPath = "E:\\leaderboards\\data\\pointsData.xlsx"
    updated_df = excel_to_ranks(excelPath)
    print(updated_df[['name', 'category', 'points', 'rank']].to_string())